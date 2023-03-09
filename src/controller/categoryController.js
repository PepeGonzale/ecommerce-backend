const Category = require("../models/categoryModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbID");

const createCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.json(newCategory);
  } catch (err) {
    throw new Error(err);
  }
});
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const updateCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateCategory);
  } catch (err) {
    throw new Error(err);
  }
});
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteCategory = await Category.findByIdAndDelete(id);
    res.json(deleteCategory);
  } catch (err) {
    throw new Error(err);
  }
});
const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    res.json(category);
  } catch (err) {
    throw new Error(err);
  }
});
const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getAllCategories,
};
