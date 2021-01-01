const Sequelize = require('sequelize');
const db = require("../config/db");
const Job = require("./Job");
const Skill = require("./Skill");

const JobSkill = db.define('JobSkill', {
    
},
{
    timestamps: false,
    freezeTableName: true
});

Job.belongsToMany(Skill, {through: JobSkill, foreignKey: "JobId"});
Skill.belongsToMany(Job, {through: JobSkill, foreignKey: "SkillId"});

module.exports = JobSkill;