const Sequelize = require('sequelize');
const db = require("../config/db");
const Job = require("./Job");

const JobEducation = db.define("JobEducation",
{
    JobId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    EducationLevelId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    FieldId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
},
{
    timestamps: false,
    freezeTableName: true
});

module.exports = JobEducation;