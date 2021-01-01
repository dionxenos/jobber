const Sequelize = require('sequelize');
const db = require("../config/db");
const User = require("./User");
const Skill = require("./Skill");

const CandidateSkill = db.define("CandidateSkill", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
    }, 
    {
    timestamps: false,
    freezeTableName: true
});

User.belongsToMany(Skill, {through: CandidateSkill, foreignKey: "UserId"});
Skill.belongsToMany(User, {through: CandidateSkill, foreignKey: "SkillId"});

module.exports = CandidateSkill;