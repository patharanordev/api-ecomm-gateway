const { Model, DataTypes } = require('sequelize');

class ProductLaptop extends Model {}

ProductLaptop._sequelize = null;

ProductLaptop.isSequelized = function() {
    return new Promise((resolve, reject) => {
        try {
            if(this._sequelize!=null) {
                this._sequelize.sync().then(() => resolve())
                .catch((err) => reject(err))
            } else { reject('Sequelize was not initialized') }
        } catch(err) { reject(err); }
    })
}

ProductLaptop.initModel = function(sequelize) {
    this._sequelize = sequelize;
    this.init({
        model: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            unique: true
        },
        category_id: { type: DataTypes.STRING, allowNull: false },
        url_image: { type: DataTypes.STRING, allowNull: false },
        brand: { type: DataTypes.STRING },
        version: { type: DataTypes.STRING },
        color: { type: DataTypes.STRING },
        price: { type: DataTypes.REAL },
        screen: { type: DataTypes.STRING },
        cpu: { type: DataTypes.STRING },
        processor: { type: DataTypes.STRING },
        memory: { type: DataTypes.STRING },
        graphic: { type: DataTypes.STRING },
        storage: { type: DataTypes.STRING },
        storage_type: { type: DataTypes.STRING }
    }, { sequelize: this._sequelize, modelName: 'product_laptop' });
}

ProductLaptop.get = function(searchCondition, searchOption=null) {

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

ProductLaptop.set = function(updateObj) {

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

ProductLaptop.add = function(newProduct) {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            if(newProduct && newProduct.items) {

                const items = Array.isArray(newProduct.items) ? newProduct.items : [];
                let bulkItems = [];
                
                items.map((o,i) => {
                    bulkItems.push({
                        model: o.model ? o.model : '',
                        category_id: o.category_id ? o.category_id : '',
                        url_image: o.url_image ? o.url_image : '',
                        brand: o.brand ? o.brand : '',
                        version: o.version ? o.version : '',
                        color: o.color ? o.color : '',
                        price: o.price ? o.price : '',
                        screen: o.screen ? o.screen : '',
                        cpu: o.cpu ? o.cpu : '',
                        processor: o.processor ? o.processor : '',
                        memory: o.memory ? o.memory : '',
                        graphic: o.graphic ? o.graphic : '',
                        storage: o.storage ? o.storage : '',
                        storage_type: o.storage_type ? o.storage_type : ''
                    })
                });

                this.bulkCreate(bulkItems, { returning: ['model'], ignoreDuplicates:true })
                .then((r) => resolve(r))
                .catch((err) => reject(err));

            } else { reject('Unknown product info object pattern.') }
        }).catch((err) => reject(err));
    })
    
}

ProductLaptop.delete = function(model) {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            if(model) {
                this.destroy({ where : { model:model } })
                .then((r) => resolve(r && r > 0 ? 'Deleted.' : 'No record was deleted.'))
                .catch((err) => reject(err));
            } else { reject('Unknown the id') }
        }).catch((err) => reject(err));
    })
    
}

ProductLaptop.dropTable = function() {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            this.drop().then((r) => resolve(r))
            .catch((err) => reject(err));
        }).catch((err) => reject(err));
    })
    
}

ProductLaptop.clearData = function() {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            this.truncate().then((r) => resolve(r))
            .catch((err) => reject(err));
        }).catch((err) => reject(err));
    })
    
}

module.exports = ProductLaptop;