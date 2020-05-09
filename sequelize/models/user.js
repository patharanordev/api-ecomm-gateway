const { Common, DataTypes } = require('./common');
const has = require('has');

class User extends Common {}

User._tableName = 'user';

User.initModel = function(sequelize) {
    this._sequelize = sequelize;
    this.init({
        user_id: {
            type: DataTypes.STRING, 
            allowNull: false,
            primaryKey: true,
            unique: true
        },
        social_id: { type: DataTypes.STRING, allowNull: false },
        username: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING },
        provider: { type: DataTypes.STRING },
        picture: { type: DataTypes.STRING },
        locale: { type: DataTypes.STRING },
        last_access: { type: DataTypes.DATE, allowNull: false }
    }, { sequelize: this._sequelize, modelName: this._tableName });
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
            if(searchOption && searchOption.attributes) stmt['attributes'] = searchOption.attributes;
            if(searchOption && searchOption.include) stmt['include'] = searchOption.include;

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
            if(has(updateObj, 'condition') && has(updateObj, 'data') && has(updateObj.condition, 'user_id')) {
                this.update(updateObj.data, { where:updateObj.condition })
                .then((r) => resolve(r))
                .catch((err) => reject(err));
            } else { reject('Unknown condition or id') }
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
            if(newUser && newUser.social_id) {
                this.findAndCountAll({ where: { social_id:newUser.social_id } })
                .then((isExist) => {
                    if(!(isExist.count && isExist.count > 0 ? true : false)) { 
                        let provider = newUser.provider ? newUser.provider : ''
                        this.create({
                            user_id: `${newUser.social_id}|${provider}`,
                            username: newUser.username ? newUser.username : '',
                            email: newUser.email ? newUser.email : '',
                            social_id: newUser.social_id,
                            provider: provider,
                            picture: newUser.picture ? newUser.picture : '',
                            locale: newUser.locale ? newUser.locale : '',
                            last_access: new Date()
                        }).then((r) => resolve(r)) 
                    } else { 
                        // console.log('Data existing : ', JSON.stringify(isExist))
                        this.setLastAccess(isExist.rows[0].user_id)
                        resolve('Data existing...')
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
                this.destroy({ 
                    where: { user_id:user_id },
                    cascade: true
                })
                .then((r) => resolve(r && r > 0 ? 'Deleted.' : 'No record was deleted.'))
                .catch((err) => reject(err));
            } else { reject('Unknown the id') }
        }).catch((err) => reject(err));
    })
    
}

module.exports = User;