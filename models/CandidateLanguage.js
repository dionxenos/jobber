const Sequelize = require('sequelize');
const db = require("../config/db");
const User = require("./User");
const Language = require("./Language");
const LanguageLevel = require("./LanguageLevel");

const CandidateLanguage = db.define("CandidateLanguge", 
    {
        UserId: {
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
    }
);

Language.hasMany(CandidateLanguage);
CandidateLanguage.belongsTo(Language);

// User.belongsToMany(Language, {through: CandidateLanguage, foreignKey: "UserId"});
// Language.belongsToMany(User, {through: CandidateLanguage, foreignKey: "LanguageId"});

// Language.belongsToMany(LanguageLevel, {through: CandidateLanguage, foreignKey: "LanguageId"});
// LanguageLevel.belongsToMany(Language, {through: CandidateLanguage, foreignKey: "LanguageLevelCode"});

module.exports = CandidateLanguage;