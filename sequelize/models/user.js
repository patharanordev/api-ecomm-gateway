const { Model, DataTypes } = require('sequelize');
const uuid = require('uuid');

class User extends Model {}

User._sequelize = null;

User.getUUID = function(namespace) {
    // Create ID from namespace at current timestamp
    return uuid.v5(namespace, uuid.v1());
}

User.isSequelized = function() {
    return new Promise((resolve, reject) => {
        try {
            if(this._sequelize!=null) {
                this._sequelize.sync().then(() => resolve())
                .catch((err) => reject(err))
            } else { reject('Sequelize was not initialized') }
        } catch(err) { reject(err); }
    })
}

User.initModel = function(sequelize) {
    this._sequelize = sequelize;
    this.init({
        user_id: {
            type: DataTypes.STRING, 
            allowNull: false,
            primaryKey: true,
            unique: true
        },
        username: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        last_access: { type: DataTypes.DATE, allowNull: false }
    }, { sequelize: this._sequelize, modelName: 'user' });
}

User.get = function(searchCondition, searchOption=null) {

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

User.set = function(updateObj) {

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

User.setLastAccess = function(user_id) {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            if(user_id) {
                this.update({ last_access: new Date() }, { where: { user_id:user_id } })
                .then((r) => resolve(r))
                .catch((err) => reject(err));
            } else { reject('Unknown user id') }
        }).catch((err) => reject(err));
    })
    
}

User.add = function(newUser) {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            if(newUser && newUser.email) {
                this.findAndCountAll({ where: { email:newUser.email } })
                .then((isExist) => {
                    if(!(isExist.count && isExist.count > 0 ? true : false)) { 
                        this.create({
                            user_id: this.getUUID(newUser.email),
                            username: newUser.username ? newUser.username : '',
                            email: newUser.email,
                            last_access: new Date()
                        }).then((r) => resolve(r)) 
                    } else { 
                        reject('Data existing...')
                    }
                })
                .catch((err) => reject(err)); 
            } else { reject('Unknown user info object pattern.') }
        }).catch((err) => reject(err));
    })
    
}

User.delete = function(user_id) {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            if(user_id) {
                this.destroy({ where : { user_id:user_id } })
                .then((r) => resolve(r && r > 0 ? 'Deleted.' : 'No record was deleted.'))
                .catch((err) => reject(err));
            } else { reject('Unknown the id') }
        }).catch((err) => reject(err));
    })
    
}

User.dropTable = function() {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            this.drop().then((r) => resolve(r))
            .catch((err) => reject(err));
        }).catch((err) => reject(err));
    })
    
}

User.clearData = function() {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            this.truncate().then((r) => resolve(r))
            .catch((err) => reject(err));
        }).catch((err) => reject(err));
    })
    
}

module.exports = User;