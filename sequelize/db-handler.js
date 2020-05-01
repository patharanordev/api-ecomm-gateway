const { 
    User,
    Payment,
    UserPayment,
    ProductCategories,
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
Payment.initModel(sequelize, { 'user':User, 'user_payment':UserPayment });
UserPayment.initModel(sequelize, { 'user':User, 'payment':Payment });
ProductCategories.initModel(sequelize);
ProductSmartphone.initModel(sequelize);
ProductLaptop.initModel(sequelize);

// Association
UserPayment.belongsTo(User, { foreignKey:'user_id', targetKey:'user_id', as:'user_payer' })
UserPayment.belongsTo(Payment, { foreignKey:'record_id', targetKey:'record_id', as:'pay_by_user' })
User.belongsToMany(Payment, { through: UserPayment, foreignKey: 'user_id' })
Payment.belongsToMany(User, { through: UserPayment, foreignKey: 'record_id' })

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