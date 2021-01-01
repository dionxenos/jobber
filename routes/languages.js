const express = require("express");
const router = express.Router();
const Language = require("../models/Language");
const Level = require("../models/LanguageLevel");

router.get("/", (req, res) => {
    Language.findAll()
    .then(languages => res.send(languages))
    .catch(err => console.log(err));
});

router.get("/levels", (req, res) => {
    Level.findAll()
    .then(levels => res.send(levels))
    .catch(err => console.log(err));
});

router.get("/:id", (req, res) => {
    const {id} = req.params;
    Language.findByPk(id).then(language => res.send(language))
    .catch(err => console.log(err));
});

router.get("/getByLangName/:name", (req, res) => {
    const {name} = req.params;
    Language.findOne({where: {Name: name}}).then(l => res.send(l))
})



module.exports = router;