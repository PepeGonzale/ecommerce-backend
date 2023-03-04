const {Router} = require('express');
const { createCategory, updateCategory,  deleteCategory, getCategory } = require('../controller/categoryController');
const {authMiddleware} = require('../middleware/authMiddleware')
const router = Router();

router.post("/create", authMiddleware, createCategory)
router.post("/update/:id", authMiddleware, updateCategory)
router.post("/delete/:id", authMiddleware, deleteCategory)
router.get("/get-category/:id", authMiddleware, getCategory)

module.exports = router