const Sequelize = require('sequelize');
const db = require("../config/db");

const EducationField = db.define('EducationField', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
},
{
    timestamps: false,
    freezeTableName: true
});

module.exports = EducationField;