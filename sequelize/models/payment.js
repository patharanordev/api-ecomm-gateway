const { Common, DataTypes } = require('./common');
const has = require('has');

class Payment extends Common {}

Payment._tableName = 'payment';
Payment._associates = {};
Payment._orderStatus = {
    PAYMENT_FAILED: 'Payment Failed',
    WAITING_FOR_VERIFY: 'Waiting for Verified',
    VERIFIED: 'Verified',
    PACKING: 'Packing',
    READY_TO_SHIP: 'Ready to Ship',
    SHIPPED: 'Shipped'
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
        user_id: { 
            type: DataTypes.STRING, allowNull: false, 
            onDelete: 'cascade', hooks: true
        },
        product_id: { type: DataTypes.STRING, allowNull: false },
        order_id: { type: DataTypes.STRING, allowNull: false },
        order_status: { type: DataTypes.STRING, allowNull: false }, 
        timestamp: { type: DataTypes.DATE, allowNull: false },
        price: { type: DataTypes.REAL, allowNull: false },
        qty: { type: DataTypes.INTEGER, allowNull: false },
        total: { type: DataTypes.REAL, allowNull: false },
        payment_method: { type: DataTypes.STRING, allowNull: false },
        payment_card_id: { type: DataTypes.STRING, allowNull: false },
        shipping: { type: DataTypes.STRING, allowNull: false },
    }, { sequelize: this._sequelize, modelName: this._tableName });
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

Payment.getOrderItemBy = function(type, options) {
    let opts = null;
    switch(type) {
        case 'list':
            opts = this.getOrderList(options);
            break;
        case 'status':
            opts = this.getOrderStatus(options);
            break;
        default:break;
    }

    return opts != null 
    ? this.get({}, opts) : 
    new Promise((resolve, reject) => reject('Unknown type of the method'))
}

Payment.getOrderList = function(options) {
    const userModelName = 'user';
    const opts = {
        include: [{
            model: this._associates[userModelName],
            attributes: ['username'],
        }]
    }

    if(options && options.order) opts['order'] = options.order
    if(options && options.limit) opts['limit'] = options.limit

    return opts
    
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

// Ex. Order status
// [
//     {
//       subject: 'W', status: 120, fullMark: 150,
//     },
//     {
//       subject: 'R', status: 98, fullMark: 150,
//     },
//     {
//       subject: 'P', status: 86, fullMark: 150,
//     },
//     {
//       subject: 'S', status: 99, fullMark: 150,
//     },
//     {
//       subject: 'V', status: 85, fullMark: 150,
//     },
//     {
//       subject: 'F', status: 65, fullMark: 150,
//     },
// ]

Payment.getOrderStatus = function(options) {
    const opts = {
        attributes: [
            ['order_status', 'name'],
            [this._sequelize.fn('COUNT', this._sequelize.col('order_status')), 'value']
        ],
        group: ['order_status']
    }

    return opts   
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

                    const user_id = has(newPayment.user_id,'sub') && has(newPayment.user_id,'provider')
                    ? `${newPayment.user_id.sub}|${newPayment.user_id.provider}`
                    : null
                    
                    if(user_id) {
                        const orderId = this.getUUID(user_id);
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
                                user_payment_id: this.getUUID(rid), 
                                user_id: user_id, 
                                record_id: rid
                            })

                            // Payment by record
                            bulkItems.push({
                                record_id: rid,
                                order_id: orderId,
                                timestamp: ts,
                                user_id: user_id,
                                product_id: o.product_id,
                                order_status: this._orderStatus.WAITING_FOR_VERIFY,
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
                    } else {
                        reject('Unknown user.')
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
                this.destroy({ 
                    where : { order_id:order_id },
                    cascade: true
                })
                .then((r) => resolve(r && r > 0 ? 'Deleted.' : 'No record was deleted.'))
                .catch((err) => reject(err));
            } else { reject('Unknown the id') }
        }).catch((err) => reject(err));
    })
    
}

module.exports = Payment;