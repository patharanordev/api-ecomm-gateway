const { Model, DataTypes } = require('sequelize');
const uuid = require('uuid');

class Common extends Model {}

Common._sequelize = null;

Common.getUUID = function(namespace) {
    // Create ID from namespace at current timestamp
    return uuid.v5(namespace, uuid.v1());
}

Common.isSequelized = function() {
    return new Promise((resolve, reject) => {
        try {
            if(this._sequelize!=null) {
                this._sequelize.sync().then(() => resolve())
                .catch((err) => reject(err))
                // resolve()
            } else { reject('Sequelize was not initialized') }
        } catch(err) { reject(err); }
    })
}

Common.modelSchema = function() {
    return new Promise((resolve, reject) => {
        let schema = Object.keys(this.rawAttributes);

        if(schema.indexOf('createdAt')>-1) schema.splice(schema.indexOf('createdAt'), 1)
        if(schema.indexOf('updatedAt')>-1) schema.splice(schema.indexOf('updatedAt'), 1)

        try { resolve(schema); } 
        catch(err) { reject(err); }
    });
}

Common.get = function(searchCondition, searchOption=null) {

    return new Promise((resolve, reject) => {
        // this.isSequelized().then(() => {
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
        // }).catch((err) => reject(err));
    })
    
}

Common.dropTable = function() {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            this.drop().then((r) => resolve(r))
            .catch((err) => reject(err));
        }).catch((err) => reject(err));
    })
    
}

Common.clearData = function() {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            this.truncate().then((r) => resolve(r))
            .catch((err) => reject(err));
        }).catch((err) => reject(err));
    })
    
}

module.exports = {
    Common,
    DataTypes
};