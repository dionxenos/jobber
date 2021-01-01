const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const User = require("../models/User");
const Skill = require("../models/Skill");
const CS = require("../models/CadidateSkill");
const { getRecommendedSkills } = require("../config/dbProcedures");


router.get("/:id",  async (req, res) => {
    const {id} = req.params;
    const skills = await User.findByPk(id, {
        include: [
            {model: Skill}
        ]
    });
    skillNames = skills.Skills.map(skill => {
        return {
            csId: skill.CandidateSkill.id,
            id: skill.id,
            name: skill.name
        } ;
    });
    skillNames.sort( (a,b) => { return a.csId - b.csId });
    res.send(skillNames);
});

router.get("/recommendedskills/:id", async (req, res) => {
    const {id} = req.params;
    const recSkills = await getRecommendedSkills(id);
    res.send(recSkills);
});

router.post("/add", ensureAuthenticated, (req, res) => {
    const {userid, skillid} = req.body;
    CS.create({
        UserId: userid,
        SkillId: skillid
    })
    .then(s => res.send(s))
    .catch(err => console.log("ERROR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"));
    
});

router.delete("/:userid/delete/:skillid", ensureAuthenticated, (req, res) => {
    const {userid, skillid} = req.params;
    CS.destroy({where: {UserId: userid, SkillId: skillid}}).then(res.send("delete was successful"));
})

module.exports = router;