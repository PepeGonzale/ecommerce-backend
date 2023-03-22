const express = require('express')
const { createUser, loginUser,  getAllUser, getUser, deleteUser, updateUser, unlockUser, blockUser, logout,handleRefreshToken, updatePassword, forgotPasswordToken, resetPassword, loginAdmin, getWishlith, saveAddress, userCart, getUserCart, emptyCart, applyCoupon, createOrder, listOrder, updateOrderStatus } = require('../controller/userController')
const {authMiddleware, isAdmin} = require('../middleware/authMiddleware')

const router = express.Router()
router.get("/wislisht",authMiddleware, getWishlith)

router.get("/logout", logout)
router.get("/refreshing", handleRefreshToken)
router.get("/all-users", getAllUser)
router.get("/users/cart",authMiddleware, getUserCart)
router.get("/list/orders",authMiddleware, listOrder)

router.post("/empty/cart",authMiddleware, emptyCart)
router.post("/update/order/status/:statusId",authMiddleware, isAdmin,updateOrderStatus)
router.post("/cart/coupon",authMiddleware, applyCoupon)

router.post("/cart/order",authMiddleware, createOrder)


router.get("/:id",authMiddleware,isAdmin, getUser)
// Post
router.post("/forgot-password-token", forgotPasswordToken)
router.post("/reset-password/:token", resetPassword)
router.post("/password", authMiddleware, updatePassword)
router.post("/register", createUser)
router.post("/login", loginUser)
router.post("/admin-login", loginAdmin)
router.post("/cart",authMiddleware, userCart)

router.post("/delete/:id", deleteUser)
router.post("/update", authMiddleware, updateUser)
router.post("/address", authMiddleware, saveAddress)

router.post("/unlock-user/:id",authMiddleware, unlockUser)
router.post("/block-user/:id",authMiddleware, blockUser)


module.exports = router