const express = require('express')
const { createUser, loginUser,  getAllUser, getUser, deleteUser, updateUser, unlockUser, blockUser, logout,handleRefreshToken, updatePassword, forgotPasswordToken, resetPassword } = require('../controller/userController')
const {authMiddleware, isAdmin} = require('../middleware/authMiddleware')

const router = express.Router()
router.get("/logout", logout)
router.get("/refreshing", handleRefreshToken)
router.get("/all-users", getAllUser)
router.get("/:id",authMiddleware,isAdmin, getUser)
// Post
router.post("/forgot-password-token", forgotPasswordToken)
router.post("/reset-password/:token", resetPassword)
router.post("/password", authMiddleware, updatePassword)
router.post("/register", createUser)
router.post("/login", loginUser)
router.post("/delete/:id", deleteUser)
router.post("/update", authMiddleware, updateUser)
router.post("/unlock-user/:id",authMiddleware, unlockUser)
router.post("/block-user/:id",authMiddleware, blockUser)


module.exports = router