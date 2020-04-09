const { 
    User,
    ProductCategories,
    Payment,
    ProductSmartphone,
    ProductLaptop,
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
ProductSmartphone.initModel(sequelize);
ProductLaptop.initModel(sequelize);

module.exports = {
    sequelize,
    models: {
        User,
        ProductCategories,
        Payment,
        ProductSmartphone,
        ProductLaptop
    }
}