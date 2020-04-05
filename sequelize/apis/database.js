
const { Sequelize } = require('sequelize');

class DatabaseHandler {
    constructor() {
        this.sequelize = null;
    }

    setConfig(db) {
        try {
            this.sequelize = new Sequelize(`postgres://${db.user}:${db.pass}@${db.host}:${db.port}/${db.name}`, {
                dialect: 'postgres',
                dialectOptions: {
                    // Default
                    ssl: process.env.NODE_ENV=='production' ? true : false
                }
            });
            // console.log(this.sequelize);
        } catch(err) {
            throw err
        }
    }

}

module.exports = DatabaseHandler;