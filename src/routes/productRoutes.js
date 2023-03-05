const express = require('express')
const {createProduct, getProduct, getAllProduct, updateProduct, deleteProduct, addToWishList, rating} = require('../controller/productController')
const { isAdmin, authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

router.post("/wishlisht", authMiddleware, addToWishList)
router.post("/rating", authMiddleware, rating)
router.post("/create", authMiddleware,isAdmin,createProduct)
router.post("/update/:id",authMiddleware,isAdmin, updateProduct)
router.post("/delete/:id",authMiddleware,isAdmin, deleteProduct)
// Get
router.get("/products/:id", getProduct)
router.get("/get-products", getAllProduct)
module.exports= router