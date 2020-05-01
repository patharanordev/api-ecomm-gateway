const { Common, DataTypes } = require('./common');
const uuid = require('uuid');

class UserPayment extends Common {}

UserPayment._tableName = 'user_payment';
UserPayment._associates = {};

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
            onDelete: 'cascade', onUpdate: 'cascade', hooks: true,
            unique: 'unique-payment-per-user'
        },
        record_id: { 
            type: DataTypes.STRING, allowNull: false, primaryKey: false,
            references: { model: this._associates['payment'], key: 'record_id' },
            onDelete: 'cascade', onUpdate: 'cascade', hooks: true,
            unique: 'unique-payment-per-user'
        },
    }, { sequelize: this._sequelize, modelName: this._tableName, underscored:true });
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