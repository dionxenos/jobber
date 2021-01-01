const Sequelize = require('sequelize');
const db = require("../config/db");

const User = db.define('User', {
    fullname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    rolecode: {
        type: Sequelize.CHAR(5),
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING(32),
        allowNull: false
    },
    telephone: {
        type: Sequelize.STRING(12),
        allowNull: false
    },
    createdOn: {
        type: Sequelize.STRING
    }
},
{
    timestamps: false,
    freezeTableName: true
});

module.exports = User;