const { 
    User,
    ProductCategories,
    Payment,
    Product_A,
    Product_B,
    Product_C 
} = require('./models/index');
const DatabaseAPIs = require('./apis/database');

const db = new DatabaseAPIs();
db.setConfig({
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME
});

const sequelize = db.sequelize;

User.initModel(sequelize);
ProductCategories.initModel(sequelize);
Payment.initModel(sequelize);
Product_A.initModel(sequelize);
Product_B.initModel(sequelize);
Product_C.initModel(sequelize);

module.exports = {
    sequelize,
    models: {
        User,
        ProductCategories,
        Payment,
        Product_A,
        Product_B,
        Product_C
    }
}