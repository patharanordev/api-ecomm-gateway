const { Common, DataTypes } = require('./common');
const has = require('has');

class ProductCategories extends Common {}

ProductCategories._tableName = 'product_categories';

ProductCategories.initModel = function(sequelize) {
    this._sequelize = sequelize;
    this.init({
        category_id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            unique: true
        },
        name: { type: DataTypes.STRING, allowNull: false },
        title: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING, allowNull: false },
        url_manual: { type: DataTypes.STRING, allowNull: false },
        last_update: { type: DataTypes.DATE, allowNull: false }
    }, { sequelize: this._sequelize, modelName: this._tableName });
}

ProductCategories.set = function(updateObj) {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            if(has(updateObj, 'condition') && has(updateObj, 'data') && has(updateObj.condition, 'category_id')) {
                this.update(updateObj.data, { where:updateObj.condition })
                .then((r) => resolve(r))
                .catch((err) => reject(err));
            } else { reject('Unknown condition or id') }
        }).catch((err) => reject(err));
    })
    
}

ProductCategories.set = function(updateObj) {

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

ProductCategories.add = function(newCategory) {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            if(newCategory && newCategory.name) {
                this.findAndCountAll({ where: { name:newCategory.name } })
                .then((isExist) => {
                    if(!(isExist.count && isExist.count > 0 ? true : false)) { 
                        const name = newCategory.name ? newCategory.name : '';
                        this.create({
                            category_id: this.getUUID(name),
                            name: name,
                            title: newCategory.title ? newCategory.title : '' ,
                            description: newCategory.description ? newCategory.description : '' ,
                            url_manual: newCategory.url_manual ? newCategory.url_manual : '' ,
                            last_update: new Date()
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

ProductCategories.delete = function(category_id) {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            if(category_id) {
                this.destroy({ where : { category_id:category_id } })
                .then((r) => resolve(r && r > 0 ? 'Deleted.' : 'No record was deleted.'))
                .catch((err) => reject(err));
            } else { reject('Unknown the id') }
        }).catch((err) => reject(err));
    })
    
}

module.exports = ProductCategories;