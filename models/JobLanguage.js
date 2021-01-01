const Sequelize = require('sequelize');
const db = require("../config/db");
const Job = require("./Job");
const Language = require("./Language");
const LanguageLevel = require("./LanguageLevel");

const JobLanguage = db.define("JobLanguage", {
    JobId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    LanguageCode: {
        type: Sequelize.CHAR(2),
        allowNull: false 
    },
    LanguageLevelCode: {
        type: Sequelize.CHAR(2),
        allowNull: false
    }
},
{
    timestamps: false,
    freezeTableName: true
});

Language.hasMany(JobLanguage);
JobLanguage.belongsTo(Language);

module.exports = JobLanguage;