const express = require("express");
const db = require("../config/db");
const router = express.Router();
const Job = require("../models/Job");
const JobSkill = require("../models/JobSkill");
const { ensureAuthenticated, ensureCandidate, ensureEmployer } = require("../config/auth");
const Skill = require("../models/Skill");
const JobLanguage = require("../models/JobLanguage");
const JobEducation = require("../models/JobEducation");

const { getSkillScoreForJob, getTotalScore } = require("../config/dbProcedures");

router.get("/",  (req, res) => {
    Job.findAll()
    .then(jobs => res.send(jobs));
});

router.get("/edit/:id", ensureAuthenticated, ensureEmployer, (req, res) => {
    res.render("jobEdit");
});

router.get("/recruit/:id", ensureAuthenticated, ensureEmployer, (req, res) => {
    res.render("recruitForJob");
})

router.get("/getByJobId/:id", ensureAuthenticated, ensureEmployer, (req, res) => {
    const {id} = req.params;
    Job.findByPk(id)
    .then(job => res.send(job));
});

router.get("/getByUserId/:id", ensureAuthenticated, (req, res) => {
    const {id} = req.params;
    Job.findAll({where: 
        {
            UserId: id
        }
    })
    .then(jobs => res.send(jobs));
});

router.post("/add", ensureAuthenticated, ensureEmployer, (req, res) => {
    const {userId, title} = req.body;

    Job.create({
        userId,
        title
    })
    .then(newJob => {
        console.log("Job added successfully");
        res.send(newJob);
    });
});

router.delete("/:id", ensureAuthenticated, ensureEmployer, (req, res) => {
    const {id} = req.params;
    Job.destroy({where: {Id: id}}).then(res.send("delete was successful"));
});

//---------------------- Skill Section ----------------------//
router.get("/getSkills/:id", (req, res) => {
    const {id} = req.params;
    Job.findByPk(id, {
        include: [
            {model: Skill}
        ]
    })
    .then(js => {
        res.send(js);
    });
});

router.post("/skills/add", (req, res) => {
    const {jobId, skillId} = req.body;
    JobSkill.create({
        JobId: jobId,
        SkillId: skillId
    })
    .then(j => res.send(j));
})

router.delete("/skills/delete/:jobid/:skillid", (req, res) => {
    const {jobid, skillid} = req.params;
    JobSkill.destroy({where: {JobId: jobid, SkillId: skillid}})
    .then(res.send("delete was successful"));
})

//---------------------- Language Section ----------------------//
router.get("/getLanguages/:id", async (req, res) => {
    const {id} = req.params;
    const query = `SELECT * FROM dbo.JobLanguage INNER JOIN Language ON JobLanguage.LanguageCode = [Language].Code WHERE JobId = ${id}`;
    const result = await db.query(query);
    res.send(result[0]);
});

router.post("/languages/add", async (req, res) => {
    const {jobId, languageCode, languageLevelCode} = req.body;
    JobLanguage.create({
        LanguageCode: languageCode,
        LanguageLevelCode: languageLevelCode,
        JobId: jobId
    }).then(j => res.send(j));
});

router.delete("/languages/delete/:langid", (req, res) => {
    const { langid } = req.params;
    JobLanguage.destroy({where: {Id: langid}}).then(res.send("delete was successful"));
});

//---------------------- Education Section ----------------------//
router.get("/getEducation/:id", async (req, res) => {
    const {id} = req.params;
    const query = `SELECT JobEducation.Id, JobId, EducationLevelId, FieldId, [Name], [Level] FROM dbo.JobEducation 
    INNER JOIN EducationField ON EducationField.Id = JobEducation.FieldId
    INNER JOIN EducationLevel ON EducationLevel.Id = JobEducation.EducationLevelId
    WHERE JobId = N'${id}'`;
    const result = await db.query(query);
    res.send(result[0]);
});

router.post("/education/add", async (req, res) => {
    const {jobId, fieldId, levelId} = req.body;
    JobEducation.create({
        EducationLevelId: levelId,
        FieldId: fieldId,
        JobId: jobId
    }).then(j => res.send(j));
});

router.delete("/education/delete/:eduid", (req, res) => {
    const { eduid } = req.params;
    JobEducation.destroy({where: {Id: eduid}}).then(res.send("delete was successful"));
});


//---------------------- Get Scores ----------------------//
router.get("/getSkillScore/:jobId", async (req, res) => {
    const {jobId} = req.params;
    const result = await getSkillScoreForJob(jobId);
    console.log(result.slice(0,25))
    res.send(result.slice(0,25));
});

router.get("/getLangScore/:jobId", async (req, res) => {

});

router.get("/getEduScore/:jobId", async (req, res) => {

});

router.post("/recruit/:jobId", async (req, res) => {
    const {jobId, skillW, langW, eduW, numOfResults} = req.body;
    const result = await getTotalScore(jobId, skillW, langW, eduW);
    res.send(result.slice(0, numOfResults));
});


module.exports = router;