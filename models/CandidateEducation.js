const Sequelize = require('sequelize');
const db = require("../config/db");
const User = require("./User");
const EducationField = require("./EducationField");
const EducationLevel = require("./EducationLevel");

const CandidateEducation = db.define("CandidateEducation", 
    {
        UserId: {
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
        },
        From: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        To: {
            type: Sequelize.INTEGER
        }
    },
    {
        timestamps: false,
        freezeTableName: true
    }
);

module.exports = CandidateEducation;

