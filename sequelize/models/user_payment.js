const { Model, DataTypes } = require('sequelize');
const uuid = require('uuid');

class UserPayment extends Model {}

UserPayment._sequelize = null;
UserPayment._tableName = 'user_payment';
UserPayment._associates = {};

UserPayment.getUUID = function(namespace) {
    // Create ID from namespace at current timestamp
    return uuid.v5(namespace, uuid.v1());
}

UserPayment.isSequelized = function() {
    return new Promise((resolve, reject) => {
        try {
            if(this._sequelize!=null) {
                this._sequelize.sync().then(() => resolve())
                .catch((err) => reject(err))
            } else { reject('Sequelize was not initialized') }
        } catch(err) { reject(err); }
    })
}

UserPayment.initModel = function(sequelize, associates) {
    this._sequelize = sequelize;
    this._associates = associates;
    this.init({
        user_payment_id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            unique: true
        },
        user_id: { 
            type: DataTypes.STRING, allowNull: false, primaryKey: false,
            references: { model: this._associates['user'], key: 'user_id' },
            onDelete: 'cascade', onUpdate: 'cascade',
            unique: 'unique-payment-per-user'
        },
        record_id: { 
            type: DataTypes.STRING, allowNull: false, primaryKey: false,
            references: { model: this._associates['payment'], key: 'record_id' },
            onDelete: 'cascade', onUpdate: 'cascade',
            unique: 'unique-payment-per-user'
        },
    }, { sequelize: this._sequelize, modelName: this._tableName, underscored:true });
}

UserPayment.modelSchema = function() {
    return new Promise((resolve, reject) => {
        let schema = Object.keys(this.rawAttributes);

        if(schema.indexOf('createdAt')>-1) schema.splice(schema.indexOf('createdAt'), 1)
        if(schema.indexOf('updatedAt')>-1) schema.splice(schema.indexOf('updatedAt'), 1)

        try { resolve(schema); } 
        catch(err) { reject(err); }
    });
}

UserPayment.record = function(records) {
    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            try {
                this.bulkCreate(records, { returning: ['user_id'], ignoreDuplicates:true })
                .then((r) => resolve(r))
                .catch((err) => reject(err));
            } catch(err) {
                reject(err);
            }
        }).catch((err) => reject(err));
    })
}

module.exports = UserPayment;