const Sequelize = require('sequelize');
require('dotenv').config({path: './.env'});

module.exports = new Sequelize('Thesis', process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    port: 50681,
    dialect: 'mssql',
    dialectOptions: {
        encrypt: true
    },
    options: {
        // "port": 50681,
        // "instanceName": 'SQLEXPRESS',
        "enableArithAbort": true,
        "validateBulkLoadParameters": true
    },
    // logging: false
});