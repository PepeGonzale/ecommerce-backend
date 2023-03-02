const {Router} = require('express');
const { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog } = require('../controller/blogController');
const {authMiddleware, isAdmin} = require('../middleware/authMiddleware')

const router = Router()
router.post("/likes", authMiddleware, likeBlog)
router.post("/", authMiddleware,isAdmin, createBlog)
router.post("/:id", authMiddleware,isAdmin, updateBlog)
router.post("/delete/:id", authMiddleware,isAdmin, deleteBlog)

router.get("/blogs", getAllBlogs)
router.get("/:id", getBlog)

module.exports = router