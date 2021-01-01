const jwt = require("jsonwebtoken");

module.exports = {
    ensureAuthenticated: function(req, res, next) {
        const token = req.cookies.jwt;
        
        if(token) {
            jwt.verify(token, "0003d04b8e93ae73189ea88a01b6a0b5", (err, decodedToken) => {
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

    // checkUser: function(req, res, next) {
    //     const token = req.cookies.jwt;

    //     if(token) {
    //         jwt.verify(token, "0003d04b8e93ae73189ea88a01b6a0b5", (err, decodedToken) => {
    //             if(err) {
    //                 console.log(err);
    //                 res.locals.user = null;
    //             }
    //             else {
    //                 res.locals.user = {};
    //             }
    //         })
    //     }
    //     else res.locals.user = null;
    // },

    ensureCandidate: function(req, res, next) {
        const token = req.cookies.jwt;
        
        if(token) {
            jwt.verify(token, "0003d04b8e93ae73189ea88a01b6a0b5", (err, decodedToken) => {
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
            jwt.verify(token, "0003d04b8e93ae73189ea88a01b6a0b5", (err, decodedToken) => {
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