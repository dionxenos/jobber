const Sequelize = require('sequelize');
const db = require("../config/db");

const Role = db.define('Role', 
{
    code: {
        type: Sequelize.CHAR(5),
        allowNull: false,
        primaryKey: true
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

module.exports = Role;