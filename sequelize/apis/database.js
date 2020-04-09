
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
                    ssl: {
                      require: true,
                      // Ref.: https://github.com/brianc/node-postgres/issues/2009
                      rejectUnauthorized: false,
                      // It should use "CA" but Heroku has not "CA"
                    },
                    keepAlive: true,        
                },      
                ssl: true,
                // logging: false
            });
            // console.log(this.sequelize);
        } catch(err) {
            throw err
        }
    }

}

module.exports = DatabaseHandler;