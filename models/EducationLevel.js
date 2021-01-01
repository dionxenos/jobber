const Sequelize = require('sequelize');
const db = require("../config/db");

const EducationLevel = db.define('EducationLevel', {
    level: {
        type: Sequelize.STRING,
        allowNull: false
    }
},
{
    timestamps: false,
    freezeTableName: true
});

module.exports = EducationLevel;