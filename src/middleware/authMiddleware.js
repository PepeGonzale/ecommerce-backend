 const User = require('../models/userModel')
 const jwt = require('jsonwebtoken');
 const asyncHandler = require('express-async-handler')

 const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
        try{
            if (token) {
                const decoded = jwt.verify(token,"mysign")
                console.log(decoded);
                const user = await User.findById(decoded.id)
                req.user = user;
                next()
            }
        } catch(err) {
            throw new Error('Not Authorized token expired, please login again')
        }
    } else {
        throw new Error('There is no token atached to the header')
    }
 })
 const isAdmin = asyncHandler(async (req, res, next) => {
    console.log(req.user);
    const {email} = req.user
    const adminUser = await User.findOne({ email });
    if(adminUser.role !== "admin") {
        throw new Error("You are not and admin")
    } else {
        next()
    }
 })

 module.exports = {authMiddleware, isAdmin}