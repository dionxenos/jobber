const express = require("express");
const router = express.Router();
const db = require("../config/db");
// const User = require("../models/User");
const CE = require("../models/CandidateEducation");
const {ensureAuthenticated} = require("../config/auth");

router.get("/", async (req, res) => {
    const results = await db.query('SELECT * FROM CandidateEducation JOIN EducationField ON EducationField.Id = CandidateEducation.FieldId JOIN EducationLevel ON EducationLevel.Id = CandidateEducation.EducationLevelId WHERE CandidateEducation.UserId = 3');
    let userEdu = {userId: results[0][0].UserId, degrees: []};
    results[0].forEach(e => {
        userEdu.degrees.push({fieldId: e.FieldId, fieldName: e.Name, levelId: e.EducationLevelId, level: e.Level});
    });
    
    res.send(userEdu);
});

router.get("/:id", async (req, res) => {
    const {id} = req.params;
    const results = await db.query(`SELECT ce.Id,UserId,[Name],[Level],[From],[To] FROM CandidateEducation As ce
    JOIN EducationField ON EducationField.Id = ce.FieldId 
    JOIN EducationLevel ON EducationLevel.Id = ce.EducationLevelId 
    WHERE ce.UserId = :id
    `,
        {replacements: {id: id}});
    if(results[1] == 0) {
        res.send([]);
    }
    else {
        let userEdu = {userId: results[0][0].UserId, degrees: []};
        results[0].forEach(e => {
            userEdu.degrees.push({id: e.Id, fieldId: e.FieldId, fieldName: e.Name, levelId: e.EducationLevelId, level: e.Level, from: e.From, to: e.To});
        });
        res.send(userEdu);
    }
});

router.post("/add", ensureAuthenticated, (req, res) => {
    const {userId, fieldId, levelId, from, to} = req.body;
    CE.create({
        UserId: userId,
        EducationLevelId: levelId,
        FieldId: fieldId,
        From: from,
        To: to
    })
    .then(ce => res.send(ce))
    .catch(err => console.log(err));
});

router.delete("/delete/:id", (req, res) => {
    const {id} = req.params;
    CE.destroy({where: {Id: id}}).then(res.send("delete was successful"));
});


module.exports = router;