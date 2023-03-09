const {Router} = require('express');
const { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog, dislikeBlog, uploadImages } = require('../controller/blogController');
const {authMiddleware, isAdmin} = require('../middleware/authMiddleware')
const {uploadPhoto, productImgResize, blogImgResize} = require('../middleware/uploadImages')
const router = Router()
router.post("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array('images', 10), blogImgResize, uploadImages)
router.post("/likes", authMiddleware, likeBlog)
router.post("/dislikes", authMiddleware, dislikeBlog)
router.post("/", authMiddleware,isAdmin, createBlog)
router.post("/:id", authMiddleware,isAdmin, updateBlog)
router.post("/delete/:id", authMiddleware,isAdmin, deleteBlog)

router.get("/blogs", getAllBlogs)
router.get("/:id", getBlog)

module.exports = router