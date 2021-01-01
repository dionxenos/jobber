const Sequelize = require('sequelize');
const db = require("../config/db");

const Skill = db.define('Skill', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
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

module.exports = Skill;