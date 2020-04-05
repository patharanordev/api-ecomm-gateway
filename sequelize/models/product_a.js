const { Model, DataTypes } = require('sequelize');

class Product_A extends Model {}

Product_A._sequelize = null;

Product_A.isSequelized = function() {
    return new Promise((resolve, reject) => {
        try {
            if(this._sequelize!=null) {
                this._sequelize.sync().then(() => resolve())
                .catch((err) => reject(err))
            } else { reject('Sequelize was not initialized') }
        } catch(err) { reject(err); }
    })
}

Product_A.initModel = function(sequelize) {
    this._sequelize = sequelize;
    this.init({
        product_id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            unique: true
        },
        model: { type: DataTypes.STRING, allowNull: false },
        category_id: { type: DataTypes.STRING, allowNull: false },
        url_image: { type: DataTypes.STRING, allowNull: false },
        attr_a_1: { type: DataTypes.STRING },
        attr_a_2: { type: DataTypes.STRING },
        attr_a_3: { type: DataTypes.STRING },
        attr_a_4: { type: DataTypes.STRING },
        attr_a_5: { type: DataTypes.STRING }
    }, { sequelize: this._sequelize, modelName: 'product_a' });
}

Product_A.get = function(searchCondition, searchOption=null) {

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

Product_A.add = function(newUser) {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            if(newUser && newUser.user_id) {
                this.findAndCountAll({ where: { user_id:newUser.user_id } })
                .then((isExist) => {
                    if(!(isExist.count && isExist.count > 0 ? true : false)) { 
                        this.create({
                            user_id: newUser.user_id,
                            username: newUser.username ? newUser.username : '',
                            email: newUser.email ? newUser.email : '',
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

Product_A.delete = function(user_id) {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            if(user_id) {
                this.destroy({ where : { user_id:user_id } })
                .then((r) => resolve(r && r > 0 ? 'Deleted.' : 'No record was deleted.'))
                .catch((err) => reject(err));
            } else { reject('Unknown user id') }
        }).catch((err) => reject(err));
    })
    
}

Product_A.dropTable = function() {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            this.drop().then((r) => resolve(r))
            .catch((err) => reject(err));
        }).catch((err) => reject(err));
    })
    
}

Product_A.clearData = function() {

    return new Promise((resolve, reject) => {
        this.isSequelized().then(() => {
            this.truncate().then((r) => resolve(r))
            .catch((err) => reject(err));
        }).catch((err) => reject(err));
    })
    
}

module.exports = Product_A;