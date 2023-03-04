const {Router} = require('express');
const { createCategory, updateCategory,  deleteCategory, getCategory, getAllCategories } = require('../controller/blogCategory');
const {authMiddleware} = require('../middleware/authMiddleware')
const router = Router();
router.get("/:id",  getCategory)
router.get("/",  getAllCategories)

router.post("/create", authMiddleware, createCategory)
router.post("/update/:id", authMiddleware, updateCategory)
router.post("/delete/:id", authMiddleware, deleteCategory)


module.exports = router