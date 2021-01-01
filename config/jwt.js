const jwt = require("jsonwebtoken");

module.exports.createToken = (id, rolecode) => {
    return jwt.sign({ id, rolecode }, "0003d04b8e93ae73189ea88a01b6a0b5", {
        expiresIn: 3*24*60*60
    })
}

