const slugify = require('slugify')
const asyncHandler = require('express-async-handler')
const productModel = require('../models/productModel')
const User = require("../models/userModel")
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

        // Filtering
        const queryObj = {...req.query}
        const excludeFields = ['page', 'sort', 'limit', 'fields']
        excludeFields.forEach((el) => delete queryObj[el])

        let queryString = JSON.stringify(queryObj)
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
        let query = productModel.find(JSON.parse(queryString))

        // Sorting
        if(req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ')
            query = query.sort(sortBy)
        } else {
            query=query.sort('-createdAt')
        }

        // limiting the fields
        if(req.query.fields) {
            const fields = req.query.fields.split(',').join(' ')
            query = query.select(fields)
        } else {
            query=query.select('__v')
        }

        // pagination 
        const page = req.query.page
        const limit = req.query.limit
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit)
        if(req.query.page) {
            const productCount = await productModel.countDocuments()
            console.log(productCount);
            if(skip>=productCount) throw new Error('This page does not exist')
        }
        console.log(page, limit, skip);

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

const addToWishList = asyncHandler(async (req,res) => {
    const {_id} = req.user;
    const {prodId} = req.body;
    try {
        const user = await User.findById(_id)
        
        const alreadyAdded = user.wishlisht.find((id) => id.toString() === prodId)
        console.log(alreadyAdded);
        if (alreadyAdded) {
            let user = await User.findByIdAndUpdate(_id, {
                $pull: {wishlisht: prodId}
            }, {new: true})
            res.json(user)
        } else {
            let user = await User.findByIdAndUpdate(_id, {
                $push: { wishlisht: prodId }
            }, {new: true})
            res.json(user)
        }
    } catch(err) {
        throw new Error(err)
    }
}) 
module.exports = {createProduct, getProduct, getAllProduct, updateProduct, deleteProduct, addToWishList}
