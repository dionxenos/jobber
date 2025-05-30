const jwt = require("jsonwebtoken");
require('dotenv').config({path: './.env'});

module.exports = {
    ensureAuthenticated: function(req, res, next) {
        const token = req.cookies.jwt;
        
        if(token) {
            jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
                if(err) {
                    console.log(err);
                    res.redirect('/login')
                } else {
                    next();
                }
            })
        } else {
            res.redirect('/login');
        }
    },
    
    ensureCandidate: function(req, res, next) {
        const token = req.cookies.jwt;
        
        if(token) {
            jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
                if(err) {
                    console.log(err);
                    res.redirect('/');
                } else {
                    if(decodedToken.rolecode == 'CANDI') next();
                    else {
                        console.log("Not authorized to view this resource");
                        res.redirect("/login");
                    } 
                }
            })
        } else {
            res.redirect('/login');
        }
    },

    ensureEmployer: function(req, res, next) {
        const token = req.cookies.jwt;
        
        if(token) {
            jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
                if(err) {
                    console.log(err);
                    res.redirect('/');
                } else {
                    if(decodedToken.rolecode == 'EMPLO') next();
                    else {
                        console.log("Not authorized to view this resource");
                        res.redirect("/login");
                    } 
                }
            })
        } else {
            res.redirect('/login');
        }
    }
}