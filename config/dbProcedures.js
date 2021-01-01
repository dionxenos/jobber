const db = require('./db');
module.exports = {
    getRecommendedSkills: async function(userid) {
        const res = await db.query('GetRecommendatedSkills :id', {replacements:{id: userid}});
        return res[0];
    },

    getSkillScoreForJob: async function(jobId) {
        const res = await db.query('GetSkillScoreForJob :id', {replacements:{id: jobId}});
        return res[0];
    },

    getLangScoreForJob: async function(jobId) {
        const res = await db.query('GetLangScoreForJob :id', {replacements:{id: jobId}});
        return res[0];
    },

    getEduScoreForJob: async function(jobId) {
        const res = await db.query('GetEduScoreForJob :id', {replacements:{id: jobId}});
        return res[0];
    },

    getTotalScore: async function(jobId, skillW, langW, eduW) {
        const res = await db.query('GetTotalScore @jobid=:id, @skillw=:sw, @langw=:lw, @eduw=:ew', {replacements:{id: jobId, sw: skillW, lw: langW, ew: eduW}});
        var old = JSON.stringify(res[0]).replace(/null/g, '"-"'); 
        var newArray = JSON.parse(old); 
        return newArray;
    }
};