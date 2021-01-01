const Sequelize = require('sequelize');
const User = require('./User');
const db = require("../config/db");

const Job = db.define('Job', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    createdOn: {
        type: Sequelize.DATE
    }
},
{
    timestamps: false,
    freezeTableName: true
});



module.exports = Job