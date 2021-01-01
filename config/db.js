const Sequelize = require('sequelize');

module.exports = new Sequelize('Thesis', 'sakis', 'Dennis1996xns', {
    host: 'jobber-db.database.windows.net',
    dialect: 'mssql',
    dialectOptions: {
        encrypt: true
    },
    options: {
        "enableArithAbort": true,
        "validateBulkLoadParameters": true
    },
    // logging: false
});