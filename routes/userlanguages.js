const express = require("express");
const router = express.Router();
// const User = require("../models/User");
const Language = require("../models/Language");
// const LanguageLevel = require("../models/LanguageLevel");
const CL = require("../models/CandidateLanguage");
const {ensureAuthenticated} = require("../config/auth");

router.get("/:id", async (req, res) => {
    const {id} = req.params;
    const result = await CL.findAll({
        where: {UserId: id}, 
        include: [{model: Language}],
        attributes: ['id','LanguageLevelCode']
    });
    res.send(result);
});

router.post("/add", ensureAuthenticated, (req, res) => {
    const {userid, languageid, languagelevel} = req.body;
    CL.create({
        UserId: userid,
        LanguageCode: languageid,
        LanguageLevelCode: languagelevel
    })
    .then(cl => {
        res.send(cl);
    })
    .catch(err => res.render("myCV"))
});

router.delete("/delete/:code", ensureAuthenticated, (req, res) => {
    const {code} = req.params;
    CL.destroy({where: {Id: code}}).then(res.send("delete was successful"));
});

module.exports = router;