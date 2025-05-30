const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { ensureAuthenticated, ensureCandidate, ensureEmployer } = require("../config/auth");
const { createToken } = require("../config/jwt");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
// const nodemailer = require("nodemailer");
// const aws = require('aws-sdk');

router.get("/", (req, res) => {
    User.findAll()
    .then(users => res.send(users))
    .catch(err => console.log(err));
});

router.get("/myuser", ensureAuthenticated, (req, res) => {
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, process.env.JWT_KEY, async (err, decodedToken) => {
            if (err) console.log(err);
            else {
                let user = await User.findByPk(decodedToken.id);
                res.send(user);
            }
        })
    }
});

router.get("/myprofile", ensureAuthenticated, (req, res) => {
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
            if (err) console.log(err);
            else {
                if(decodedToken.rolecode == "CANDI") res.render("myProfileCandi");
                else if(decodedToken.rolecode == "EMPLO") res.render("myProfileEmplo");
            }
        })
    }
});

router.get("/myprofile/edit", ensureAuthenticated, (req, res) => {
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
            if (err) console.log(err);
            else {
                if(decodedToken.rolecode == "CANDI") res.render("contactInfoCandiEdit");
                else if(decodedToken.rolecode == "EMPLO") res.render("contactInfoEmploEdit");
            }
        })
    }
});

router.put("/myprofile/edit", ensureAuthenticated, (req, res) => {
    const {fullname, email, tel, id} = req.body;
    User.update({
        fullname,
        email,
        telephone: tel
    },{where: {Id: id},returning: true,
    plain: true}).then(e => {
        res.send(e);
    })
});

router.delete("/myprofile/delete", ensureAuthenticated, (req, res) => {
    const {id} = req.body;
    User.destroy({where: {Id: id}})
        .then(e => {
            res.cookie('jwt','',{maxAge: 1});
            console.log("successfully deleted");
            res.render("signup");
        });
});

router.get("/cv", ensureAuthenticated, ensureCandidate, (req, res) => {
    res.render("myCV");
});

router.get("/e/jobs", ensureAuthenticated, ensureEmployer, (req, res) => {
    res.render("myJobsEmplo");
})

router.get("/logout", (req, res) => {
    res.cookie('jwt','',{maxAge: 1});
    // req.logOut();
    console.log("successfully logged out");
    res.redirect("/login");
});

router.get("/findById/:id", (req, res) => {
    const { id } = req.params;
    User.findByPk(id)
    .then(user => res.send(user))
    .catch(err => console.log(err));
});

// SEARCH
router.post("/search-user", (req, res) => {
    const { id } = req.body;
    User.findByPk(id)
    .then(user => {
        res.send(user)
    })
    .catch(err => console.log(err));
});

router.get("/user/:id", (req, res) => {
    const { id } = req.params;

    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, process.env.JWT_KEY, async (err, decodedToken) => {
            if (err) console.log(err);
            else {
                User.findByPk(id)
                .then(user => {
                    if(user.rolecode == 'CANDI') res.render("otherCandi", {rolecode: decodedToken.rolecode});
                    else if(user.rolecode == 'EMPLO') res.render("otherEmplo", {rolecode: decodedToken.rolecode});
                })
                .catch(err => console.log(err));
            }
        })
    }
});

// END OF SEARCH
router.post("/login", (req, res) => {
    const {email, password} = req.body;
    User.findOne({where: { email }})
    .then(user => {
        if(!user) {
            console.log("No user matches this email");
            res.send(null);
        }
        else if(md5(password).toUpperCase() === user.password.toUpperCase()) {
                const token = createToken(user.id, user.rolecode);
                res.cookie('jwt', token, {httpOnly: true, maxAge: 24*60*60*1000});
                console.log("login successful");
                res.send("login successful");
        }
        else {
            console.log("Incorrect password");
            res.send(null);
        }
    });
});

router.post("/add", (req, res) => {
    const {name, tel, email, password, role} = req.body;
    User.create({
        fullname: name,
        rolecode: role,
        email: email,
        password: md5(password).toUpperCase(),
        telephone: tel,
        createdOn: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')  
    })
    .then(user => {
        const token = createToken(user.id, user.rolecode);
        res.cookie('jwt', token, {httpOnly: true, maxAge: 24*60*60*1000});
        res.send(user);
    })
    .catch(err => console.log(err));
})

// EMAIL VALIDATION
router.get("/email_exists", (req, res) => {
    const email = req.query.email;
    console.log(email);
    User.findAll({where: {email}})
    .then(e => {
        if(e.length !== 0) {
            res.send(false)
        }
        else {
            res.send(true)
        }
    })
})

// INVITES
router.post("/inv", (req, res) => {
    const {from, to} = req.body;
    db.query('INSERT INTO Interview (EmploId, CandId) VALUES (:emploId, :candId)', {replacements: {emploId: from, candId: to}});
    res.send("ADDED INVITE")
});

router.get("/emploInvs/:id", ensureEmployer, async (req, res) => {
    const {id} = req.params;
    const results = await db.query('SELECT i.Id, u.Email, u.FullName, u.Id as CandId, Has_Accepted FROM Interview i INNER JOIN dbo.[User] u ON i.CandId=u.Id WHERE EmploId=:id', {replacements: {id: id}});
    res.send(results[0]);
});

router.get("/candInvs/:id", ensureCandidate, async (req, res) => {
    const {id} = req.params;
    const results = await db.query('SELECT i.Id, u.Email, u.FullName, u.Id as EmploId, Has_Accepted FROM Interview i INNER JOIN dbo.[User] u ON i.EmploId=u.Id WHERE CandId=:id', {replacements: {id: id}});
    res.send(results[0]);
});

router.put("/accept", ensureAuthenticated, async (req, res) => {
    const {id} = req.body;
    const results = await db.query(`UPDATE Interview SET Has_Accepted='true' WHERE Id=:id`, {replacements: {id: id}});
    res.send(results);
});

router.delete("/decline", ensureAuthenticated, async (req, res) => {
    const {id} = req.params;
    db.query(`DELETE FROM Interview WHERE Id=:id`, {replacements: {id: id}});
    res.send("DELETED INVITE");
});

// IMAGE UPLOAD
router.post("/uploadImage", (req, res) => {
    console.log();
})

module.exports = router;