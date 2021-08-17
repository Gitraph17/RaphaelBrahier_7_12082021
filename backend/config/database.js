// Connexion de Sequelize à la BDD. 

require('dotenv').config();
const { Sequelize} = require("sequelize");

module.exports = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: "mysql",
    host: "localhost",
    logging: false,
    dialectOptions: {
        typeCast: function (field, next) { // for reading from database
          if (field.type === 'DATETIME') {
            return field.string()
          }
            return next()
          },
      },
    timezone: '+02:00',
});

