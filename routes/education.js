const express = require("express");
const router = express.Router();
const EducationField = require("../models/EducationField");
const EducationLevel = require("../models/EducationLevel");

router.get("/fields", (req, res) => {
    EducationField.findAll()
    .then(fields => res.send(fields))
    .catch(err => console.log(err));
})

router.get("/levels", (req, res) => {
    EducationLevel.findAll()
    .then(levels => res.send(levels))
    .catch(err => console.log(err));
})

router.get("/fields/:id", (req, res) => {
    const {id} = req.params;
    EducationField.findByPk(id)
    .then(field => res.send(field))
    .catch(err => console.log(err));
})

router.get("/levels/:id", (req, res) => {
    const {id} = req.params;
    EducationLevel.findByPk(id)
    .then(level => res.send(level))
    .catch(err => console.log(err));
})

router.get("/fields/getbyName/:name", (req, res) => {
    const {name} = req.params;
    EducationField.findOne({where: {Name: name}})
    .then(field => res.send(field))
    .catch(err => console.log(err));
})

router.get("/levels/getByName/:level", (req, res) => {
    const {level} = req.params;
    EducationLevel.findOne({where: {Level: level}})
    .then(level => res.send(level))
    .catch(err => console.log(err));
})

module.exports = router;