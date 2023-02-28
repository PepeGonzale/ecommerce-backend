const express = require('express')
const {createProduct, getProduct, getAllProduct, updateProduct, deleteProduct} = require('../controller/productController')
const { isAdmin, authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()


router.post("/create", authMiddleware,isAdmin,createProduct)
router.post("/update/:id",authMiddleware,isAdmin, updateProduct)
router.post("/delete/:id",authMiddleware,isAdmin, deleteProduct)
router.get("/products/:id", getProduct)
router.get("/get-products", getAllProduct)
module.exports= router