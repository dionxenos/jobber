const Sequelize = require('sequelize');

module.exports = new Sequelize('Thesis', 'sakis', 'dennis1996', {
    host: 'localhost',
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