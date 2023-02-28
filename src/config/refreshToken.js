const jwt = require('jsonwebtoken')

const generateRefreshToken = (id) => {
    return jwt.sign({id}, "mysign", {expiresIn: "3d"})
}
module.exports = {generateRefreshToken}