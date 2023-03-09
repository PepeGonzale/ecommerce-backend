const {Router} = require('express');
const { createCoupon, getAllCoupons, updateCoupon, deleteCoupon } = require('../controller/couponController');
const {authMiddleware, isAdmin} = require('../middleware/authMiddleware')
const router = Router();

router.post("/create", authMiddleware,isAdmin, createCoupon)
router.post("/update/:id", authMiddleware, updateCoupon)
router.post("/delete/:id", authMiddleware, deleteCoupon)
router.get("/coupons", authMiddleware, isAdmin, getAllCoupons)


module.exports = router