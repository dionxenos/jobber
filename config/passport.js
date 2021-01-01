const User = require("../models/User");
const localStrategy = require("passport-local").Strategy;
const md5 = require("md5");

module.exports = function(passport) {

    passport.use(
        new localStrategy({ usernameField: "email", passwordField: "password", passReqToCallback: true }, (req, email, password, done) => {
            User.findOne({where: {email: email}})
            .then(user => {
                if(!user) return done(null, false);
                if(md5(password).toUpperCase() === user.password.toUpperCase()) {
                    return done(null, user)
                }
                else {
                    return done(null, false);
                }
            })
            .catch(err => console.log(err));
        })
    );

    passport.serializeUser((user,cb) => {
        cb(null, user.id);
    })

    passport.deserializeUser((id, cb) => {
        User.findByPk(id)
        .then(user => {
            const userInfo = { 
                id: user.id, 
                rolecode: user.rolecode, 
                name: user.fullname, 
                telephone: user.telephone, 
                email: user.email, 
                createdOn: user.createdOn
            };
            cb(null, userInfo);
        })
        .catch(err =>  console.log(err));
    })

}