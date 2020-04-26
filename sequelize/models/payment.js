const { Model, DataTypes } = require('sequelize');
const uuid = require('uuid');

class Payment extends Model {}

Payment._sequelize = null;
Payment._tableName = 'payment';
Payment._associates = {};

Payment.getUUID = function(namespace) {
    // Create ID from namespace at current timestamp
    return uuid.v5(namespace, uuid.v1());
}

Payment.isSequelized = function() {
    return new Promise((resolve, reject) => {
        try {
            if(this._sequelize!=null) {
                this._sequelize.sync().then(() => resolve())
                .catch((err) => reject(err))
            } else { reject('Sequelize was not initialized') }
        } catch(err) { reject(err); }
    })
}

Payment.initModel = function(sequelize, associates) {
    this._sequelize = sequelize;
    this._associates = associates;
    this.init({
        record_id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            unique: true
        },
        order_id: { type: DataTypes.STRING, allowNull: false },
        timestamp: { type: DataTypes.DATE, allowNull: false },
        user_id: { type: DataTypes.STRING, allowNull: false },
        product_id: { type: DataTypes.STRING, allowNull: false },
        price: { type: DataTypes.REAL, allowNull: false },
        qty: { type: DataTypes.INTEGER, allowNull: false },
        total: { type: DataTypes.REAL, allowNull: false },
        payment_method: { type: DataTypes.STRING, allowNull: false },
        payment_card_id: { type: DataTypes.STRING, allowNull: false },
        shipping: { type: DataTypes.STRING, allowNull: false },
    }, { sequelize: this._sequelize, modelName: this._tableName });
}

Payment.modelSchema = function() {
    return new Promise((resolve, reject) => {
        let schema = Object.keys(this.rawAttributes);

        if(schema.indexOf('createdAt')>-1) schema.splice(schema.indexOf('createdAt'), 1)
        if(schema.indexOf('updatedAt')>-1) schema.splice(schema.indexOf('updatedAt'), 1)

        try { resolve(schema); } 
        catch(err) { reject(err); }
    });
}

Payment.get = function(searchCondition, searchOption=null) {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            let stmt = {};

            if(searchCondition) stmt['where'] = searchCondition;
            if(searchOption && searchOption.offset) stmt['offset'] = searchOption.offset;
            if(searchOption && searchOption.limit) stmt['limit'] = searchOption.limit;
            if(searchOption && searchOption.order) stmt['order'] = searchOption.order;
            if(searchOption && searchOption.group) stmt['group'] = searchOption.group;
            if(searchOption && searchOption.attributes) stmt['attributes'] = searchOption.attributes;
            if(searchOption && searchOption.include) stmt['include'] = searchOption.include;

            if(Object.keys(stmt).length>0) {
                this.findAll(stmt).then((r) => resolve(r))
                .catch((err) => reject(err));
            } else { reject('Unknown filter condition pattern') }
        }).catch((err) => reject(err));
    })
    
}

Payment.set = function(updateObj) {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            if(updateObj.condition && updateObj.data) {
                this.update(updateObj.data, { where:updateObj.condition })
                .then((r) => resolve(r))
                .catch((err) => reject(err));
            } else { reject('Unknown condition or data') }
        }).catch((err) => reject(err));
    })
    
}

Payment.sumColumn = function(sumObj) {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            if(sumObj && sumObj.columnName) {
                let p = sumObj.condition
                ? this.sum(sumObj.columnName, { where: sumObj.condition })
                : this.sum(sumObj.columnName)
                
                p.then((r) => resolve(r))
                .catch((err) => reject(err));
            } else { reject('Unknown column name') }
        }).catch((err) => reject(err));
    })
    
}

Payment.getRecentOrder = function(options) {
    const userModelName = 'user';
    const opts = {
        include: [{
            model: this._associates[userModelName],
            attributes: ['username'],
        }]
    }

    if(options && options.order) opts['order'] = options.order
    if(options && options.limit) opts['limit'] = options.limit

    return this.get({}, opts)
    
}

Payment.getDailyAccount = function(options) {
    // const userModelName = 'user';
    const dt = this._sequelize.fn('date_trunc', 'day', this._sequelize.col('timestamp'));
    const opts = {
        attributes: [
            [dt, 'date'],
            [this._sequelize.fn('SUM', this._sequelize.col('total')), 'total']
        ],
        group: ['date']
    }

    // if(options && options.order) opts['order'] = options.order
    // if(options && options.limit) opts['limit'] = options.limit

    return this.get({}, opts)
    
}

/**
 * Payment.add
 * 
 * Add new order from client
 * @param {object} newPayment - contain all items in cart, example :
 * {
 *   order_id:
 *   user_id:
 *   payment_method:
 *   payment_card_id:
 *   shipping:
 *   total:
 *   items: [{
 *     product_id:
 *     price:
 *     qty:
 *   }]
 * }  
 */
Payment.add = function(newPayment) {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            if(newPayment && newPayment.user_id && newPayment.items && newPayment.payment) {

                try {
                    
                    let errStack = [];
                    let bulkItems = [];
                    let bulkRecords = [];

                    const orderId = this.getUUID(newPayment.user_id);
                    const items = Array.isArray(newPayment.items) ? newPayment.items : [];
                    const ts = new Date();
                    const payment = {
                        method: newPayment.payment.method ? newPayment.payment.method : '',
                        card_id: newPayment.payment.card_id ? newPayment.payment.card_id : '',
                        shipping: newPayment.payment.shipping ? newPayment.payment.shipping : '',
                    };
                    
                    items.map((o,i) => {

                        let totalInRecond = -1;
                        try {
                            totalInRecond = (parseFloat(o.price)*o.qty);
                        } catch(err) {
                            errStack.push(`Calculate total price error : ${JSON.stringify(err)}`);
                            console.error('Calculate total price error :', err);
                        }

                        const rid = this.getUUID(orderId);

                        // Record
                        bulkRecords.push({ 
                            user_payment_id:this.getUUID(rid), 
                            user_id:newPayment.user_id, 
                            record_id:rid
                        })

                        // Payment by record
                        bulkItems.push({
                            record_id: rid,
                            order_id: orderId,
                            timestamp: ts,
                            user_id: newPayment.user_id,
                            product_id: o.product_id,
                            price: o.price,
                            qty: o.qty,
                            total: totalInRecond,
                            payment_method: payment.method,
                            payment_card_id: payment.card_id,
                            shipping: payment.shipping
                        })
                    });

                    if(errStack.length<=0) {
                        this.bulkCreate(bulkItems, { returning: ['order_id'] })
                        .then((r) => {
                            this._associates['user_payment']
                            .record(bulkRecords)
                            .then((r) => resolve(r))
                            .catch((err) => reject(err));
                        })
                        .catch((err) => reject(err));
                    } else {
                        reject(errStack)
                    }
                } catch(err) {
                    reject(err)
                }

            } else { reject('Unknown payment info object pattern.') }
        }).catch((err) => reject(err));
    })
    
}

Payment.delete = function(order_id) {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            if(order_id) {
                this.destroy({ where : { order_id:order_id } })
                .then((r) => resolve(r && r > 0 ? 'Deleted.' : 'No record was deleted.'))
                .catch((err) => reject(err));
            } else { reject('Unknown the id') }
        }).catch((err) => reject(err));
    })
    
}

Payment.dropTable = function() {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            this.drop({ cascade:true }).then((r) => resolve(r))
            .catch((err) => reject(err));
        }).catch((err) => reject(err));
    })
    
}

Payment.clearData = function() {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            this.truncate().then((r) => resolve(r))
            .catch((err) => reject(err));
        }).catch((err) => reject(err));
    })
    
}

module.exports = Payment;