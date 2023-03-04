const {Router} = require('express');
const { createBrand, updateBrand,  deleteBrand, getBrand, getAllCategories } = require('../controller/brandController');
const {authMiddleware} = require('../middleware/authMiddleware')
const router = Router();
router.get("/:id",  getBrand)
router.get("/",  getAllCategories)
router.post("/create", authMiddleware, createBrand)
router.post("/update/:id", authMiddleware, updateBrand)
router.post("/delete/:id", authMiddleware, deleteBrand)


module.exports = router