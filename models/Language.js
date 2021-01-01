const Sequelize = require('sequelize');
const db = require("../config/db");

const Language = db.define('Language', {
    code: {
        type: Sequelize.CHAR("2"),
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
},
{
    timestamps: false,
    freezeTableName: true
});

module.exports = Language;