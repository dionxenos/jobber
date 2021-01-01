const Sequelize = require('sequelize');
const db = require("../config/db");

const LanguageLevel = db.define('LanguageLevel', {
    code: {
        type: Sequelize.CHAR("2"),
        primaryKey: true,
        allowNull: false
    }
},
{
    timestamps: false,
    freezeTableName: true
});

module.exports = LanguageLevel;