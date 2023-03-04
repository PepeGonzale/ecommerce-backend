const Brand = require("../models/brandModel")
const asyncHandler = require("express-async-handler")
const validateMongoDbId = require("../utils/validateMongodbID")

const createBrand = asyncHandler(async (req, res) => {
    try {
        const newBrand = await Brand.create(req.body)
        res.json(newBrand)
    } catch(err) {
        throw new Error(err)
    }
})
const updateBrand = asyncHandler(async (req, res) => {
    const {id} = req.params
    try {
        const updateBrand = await Brand.findByIdAndUpdate(id, req.body, {new: true})
        res.json(updateBrand)
    } catch(err) {
        throw new Error(err)
    }
})
const deleteBrand = asyncHandler(async (req, res) => {
    const {id} = req.params
    try {
        const deleteBrand = await Brand.findByIdAndDelete(id)
        res.json(deleteBrand)
    } catch(err) {
        throw new Error(err)
    }
})
const getBrand = asyncHandler(async (req, res) => {
    const {id} = req.params
    try {
        const brand = await Brand.findById(id)
        res.json(brand)
    } catch(err) {
        throw new Error(err)
    }
})
const getAllCategories = asyncHandler(async (req, res) => {

    try {
        const categories = await Brand.find();
        res.json(categories)
    } catch(err) {
        throw new Error(err)
    }
})


module.exports = {
    createBrand,
    updateBrand,
    deleteBrand,
    getBrand,
    getAllCategories
}