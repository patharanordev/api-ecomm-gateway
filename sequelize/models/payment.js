const { Model, DataTypes } = require('sequelize');
const uuid = require('uuid');

class Payment extends Model {}

Payment._sequelize = null;
Payment._tableName = 'payment';

Payment.getUUID = function(namespace) {
    // Create ID from namespace at current timestamp
    return uuid.v5(namespace, uuid.v1());
}

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

Payment.initModel = function(sequelize) {
    this._sequelize = sequelize;
    this.init({
        order_id: { type: DataTypes.STRING, allowNull: false },
        timestamp: { type: DataTypes.DATE, allowNull: false },
        user_id: { type: DataTypes.STRING, allowNull: false },
        product_id: { type: DataTypes.STRING, allowNull: false },
        price: { type: DataTypes.REAL, allowNull: false },
        qty: { type: DataTypes.INTEGER, allowNull: false }
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

/**
 * Payment.add
 * 
 * Add new order from client
 * @param {object} newPayment - contain all items in cart, example :
 * {
 *   order_id:
 *   user_id:
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
            if(newPayment && newPayment.user_id && newPayment.items) {

                const orderId = this.getUUID(newPayment.user_id);
                const items = Array.isArray(newPayment.items) ? newPayment.items : [];
                const ts = new Date();
                let bulkItems = [];
                
                items.map((o,i) => {
                    bulkItems.push({
                        order_id: orderId,
                        timestamp: ts,
                        user_id: newPayment.user_id,
                        product_id: o.product_id,
                        price: o.price,
                        qty: o.qty
                    })
                });

                this.bulkCreate(bulkItems, { returning: ['order_id'] })
                .then((r) => resolve(r))
                .catch((err) => reject(err));

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
            this.drop().then((r) => resolve(r))
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