const express = require("express");
const router = express.Router();
const Skill = require("../models/Skill");

router.get("/", (req, res) => {
    Skill.findAll({order: [['Name', 'ASC']]})
    .then(skills => res.send(skills))
    .catch(err => console.log(err));
});

router.get("/:id", (req, res) => {
    const {id} = req.params;
    Skill.findByPk(id).then(skill => res.send(skill))
    .catch(err => console.log(err));
});

// router.post("/add", (req, res) => {
//     Skill.create()
// })

module.exports = router;
