const { Model, DataTypes } = require('sequelize');
const uuid = require('uuid');
const has = require('has');

class ProductSmartphone extends Model {}

ProductSmartphone._sequelize = null;
ProductSmartphone._tableName = 'product_smartphone';

ProductSmartphone.getUUID = function(namespace) {
    // Create ID from namespace at current timestamp
    return uuid.v5(namespace, uuid.v1());
}

ProductSmartphone.isSequelized = function() {
    return new Promise((resolve, reject) => {
        try {
            if(this._sequelize!=null) {
                this._sequelize.sync().then(() => resolve())
                .catch((err) => reject(err))
            } else { reject('Sequelize was not initialized') }
        } catch(err) { reject(err); }
    })
}

ProductSmartphone.initModel = function(sequelize) {
    this._sequelize = sequelize;
    this.init({
        pid: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            unique: true
        },
        model: { type: DataTypes.STRING, allowNull: false },
        category_id: { type: DataTypes.STRING, allowNull: false },
        url_image: { type: DataTypes.STRING, allowNull: false },
        brand: { type: DataTypes.STRING },
        version: { type: DataTypes.STRING },
        color: { type: DataTypes.STRING },
        price: { type: DataTypes.REAL }
    }, { sequelize: this._sequelize, modelName: this._tableName });
}

ProductSmartphone.modelSchema = function() {
    return new Promise((resolve, reject) => {
        let schema = Object.keys(this.rawAttributes);

        if(schema.indexOf('createdAt')>-1) schema.splice(schema.indexOf('createdAt'), 1)
        if(schema.indexOf('updatedAt')>-1) schema.splice(schema.indexOf('updatedAt'), 1)

        try { resolve(schema); } 
        catch(err) { reject(err); }
    });
}

ProductSmartphone.get = function(searchCondition, searchOption=null) {

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

ProductSmartphone.set = function(updateObj) {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            if(has(updateObj, 'condition') && has(updateObj, 'data') && has(updateObj.condition, 'pid')) {
                this.update(updateObj.data, { where:updateObj.condition })
                .then((r) => resolve(r))
                .catch((err) => reject(err));
            } else { reject('Unknown condition or id') }
        }).catch((err) => reject(err));
    })
    
}

ProductSmartphone.add = function(newProduct) {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            if(newProduct && newProduct.items) {

                try {

                    const items = Array.isArray(newProduct.items) ? newProduct.items : [];
                    let bulkItems = [];

                    items.map((o,i) => {

                        let price = 0;
        
                        try { price = o.price ? parseFloat(o.price) : 0 } 
                        catch(err) { price = -1; }
                        
                        const model = o.model ? o.model : '';
                        bulkItems.push({
                            pid: this.getUUID(model),
                            model: model,
                            category_id: o.category_id ? o.category_id : '',
                            url_image: o.url_image ? o.url_image : '',
                            brand: o.brand ? o.brand : '',
                            version: o.version ? o.version : '',
                            color: o.color ? o.color : '',
                            price: price
                        })
                    });

                    this.bulkCreate(bulkItems, { returning: ['model'], ignoreDuplicates:true })
                    .then((r) => resolve(r))
                    .catch((err) => reject(err));

                } catch(err) {
                    console.log(err)
                    reject(err)
                }
                
            } else { reject('Unknown product info object pattern.') }
        }).catch((err) => reject(err));
    })
    
}

ProductSmartphone.delete = function(id) {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            if(id) {
                this.destroy({ where : { pid:id } })
                .then((r) => resolve(r && r > 0 ? 'Deleted.' : 'No record was deleted.'))
                .catch((err) => reject(err));
            } else { reject('Unknown the id') }
        }).catch((err) => reject(err));
    })
    
}

ProductSmartphone.dropTable = function() {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            this.drop().then((r) => resolve(r))
            .catch((err) => reject(err));
        }).catch((err) => reject(err));
    })
    
}

ProductSmartphone.clearData = function() {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            this.truncate().then((r) => resolve(r))
            .catch((err) => reject(err));
        }).catch((err) => reject(err));
    })
    
}

module.exports = ProductSmartphone;