const jwt = require("jsonwebtoken");

module.exports.createToken = (id, rolecode) => {
    return jwt.sign({ id, rolecode }, process.env.JWT_KEY, {
        expiresIn: 3*24*60*60
    })
}

