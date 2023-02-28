const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({id}, "mysign", {expiresIn: "1d"})
}

module.exports = {generateToken}