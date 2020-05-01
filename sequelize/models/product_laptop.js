const { Common, DataTypes } = require('./common');
const has = require('has');

class ProductLaptop extends Common {}

ProductLaptop._tableName = 'product_laptop';

ProductLaptop.initModel = function(sequelize) {
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
        url_image: { type: DataTypes.STRING },
        brand: { type: DataTypes.STRING },
        version: { type: DataTypes.STRING },
        color: { type: DataTypes.STRING },
        price: { type: DataTypes.REAL, allowNull: false },
        screen: { type: DataTypes.STRING },
        cpu: { type: DataTypes.STRING },
        processor: { type: DataTypes.STRING },
        memory: { type: DataTypes.STRING },
        graphic: { type: DataTypes.STRING },
        storage: { type: DataTypes.STRING },
        storage_type: { type: DataTypes.STRING }
    }, { sequelize: this._sequelize, modelName: this._tableName });
}

ProductLaptop.set = function(updateObj) {

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

ProductLaptop.add = function(newProduct) {

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
                            price: price,
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

                } catch(err) {
                    console.log(err)
                    reject(err)
                }
            
            } else { reject('Unknown product info object pattern.') }
        }).catch((err) => reject(err));
    })
    
}

ProductLaptop.delete = function(id) {

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

module.exports = ProductLaptop;