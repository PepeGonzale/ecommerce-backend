const slugify = require('slugify')
const asyncHandler = require('express-async-handler')
const productModel = require('../models/productModel')

const createProduct = asyncHandler(async (req, res) => {
    try {
        if(req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await productModel.create(req.body)
        res.json(newProduct)
    } catch(err) {
        throw new Error(err)
    }
})
const getProduct = asyncHandler(async (req, res) => {
    const {id} = req.params
    try{
        const findProduct = await productModel.findById(id)
        res.json(findProduct)
    } catch (err) {
        throw new Error(err)
    }
})
const getAllProduct = asyncHandler(async (req, res) => {
    try {
        const queryObj = {...req.query}
        const excludeFields = ['page', 'sort', 'limit', 'fields']
        excludeFields.forEach((el) => delete queryObj[el])

        let queryString = JSON.stringify(queryObj)
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
        console.log(JSON.parse(queryString));
        const query = productModel.find(JSON.parse(queryString))
        const product = await query; 
        res.json(product)
    } catch(err) {
        throw new Error(err)
    }
})
const updateProduct = asyncHandler(async (req, res) => {
    const {id} = req.params
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const updateProduct = await productModel.findOneAndUpdate(id, req.body, {new:true})
        res.json(updateProduct)
    } catch(err) {
        throw new Error(err)
    }
})
const deleteProduct = asyncHandler(async (req, res) => {
    const {id} = req.params
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const deleteProduct = await productModel.findOneAndDelete(id, req.body, {new:true})
        res.json(deleteProduct)
    } catch(err) {
        throw new Error(err)
    }
})
module.exports = {createProduct, getProduct, getAllProduct, updateProduct, deleteProduct}
