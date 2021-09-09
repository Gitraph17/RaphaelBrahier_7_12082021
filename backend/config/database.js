// CONFIGURATION DE LA CONNEXION DE SEQUELIZE A LA BDD MySsql 
const { Sequelize } = require("sequelize");
require('dotenv').config();

module.exports= new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: "mysql",
    host: "localhost",
    logging: false,
    dialectOptions: {
      typeCast: function (field, next) {   // Pour lire la BDD
        if (field.type === 'DATETIME') {
          return field.string()
        }
          return next()
      },
    },
    timezone: '+02:00', // Pour écrire dans la BDD
});

