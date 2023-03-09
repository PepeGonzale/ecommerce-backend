const Blog = require('../models/blogModel')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler');
const { validateMongoDbId } = require('../utils/validateMongodbID');
const { findOne, findById } = require('../models/blogModel');
const cloudinaryUploadImg = require('../utils/cloudinary')
const fs = require('fs')

const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json(newBlog)
    } catch(err) {
        throw new Error(err)
    }
});

const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updateBlog)
    } catch(err) {
        throw new Error(err)
    }
})

const getBlog = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const getBlog = await Blog.findById(id).populate('likes')
        const updateViews = await Blog.findByIdAndUpdate(id, {
            //INcrementamos el nunero de visitas a nuestra pagina en 1
            $inc: {numViews: 1}
        }, { new: true })
        res.json(updateViews)
    } catch(err) {
        throw new Error(err)
    }
})

const getAllBlogs = asyncHandler(async (req, res) => {
    try {
        const getBlogs = await Blog.find({})
        res.json(getBlogs)
    }catch(err) {
        throw new Error(err)
    }
})
const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const deleteBlog = await Blog.findByIdAndDelete(id)
        res.json(deleteBlog)
    } catch(err) {
        throw new Error(err)
    }
})
const likeBlog = asyncHandler(async (req, res) => {
    const {blogId} = req.body;
    validateMongoDbId(blogId)
    // Find the blog which you want to be liked
    const blog = await Blog.findById(blogId)
     
   // find the login user
    const loginUserId = req?.user?._id
   
    // find if the user has liked the post
    const isLiked = blog?.isLiked;
    
    // find the user if he disliked the blog
    const alreadyDisliked = blog?.dislikes?.find((userId) => userId?.toString() === loginUserId?.toString())

    if (alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate({blogId}, {
            $pull: {dislikes: loginUserId },
            isDisliked: false
        }, {new : true})
        console.log(blog);
        res.json(blog)
    }
    if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: {likes: loginUserId },
            isLiked: false
        }, { new : true })
        res.json(blog)
    }
    else {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: {likes: loginUserId },
            isLiked: true
        }, { new : true })
        res.json(blog)
    }
    

})
const dislikeBlog = asyncHandler(async (req, res) => {
    const {blogId} = req.body;
    validateMongoDbId(blogId)
    // Find the blog which you want to be liked
    const blog = await Blog.findById(blogId)
     
   // find the login user
    const loginUserId = req?.user?._id
   
    // find if the user has liked the post
    const isDisliked = blog?.isDisliked;
    
    // find the user if he disliked the blog
    const alreadyLiked = blog?.likes?.find((userId) => userId?.toString() === loginUserId?.toString())

    if (alreadyLiked) {
        const blog = await Blog.findByIdAndUpdate({blogId}, {
            $pull: {likes: loginUserId },
            isLiked: false
        }, {new : true})
        console.log(blog);
        res.json(blog)
    }
    if (isDisliked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: {dislikes: loginUserId },
            isDisliked: false
        }, { new : true })
        res.json(blog)
    }
    else {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: {dislikes: loginUserId },
            isDisliked: true
        }, { new : true })
        res.json(blog)
    }
    

})

const uploadImages = asyncHandler(async (req, res) => {

    const {id} = req.params;
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const {path} = file;
      const newpath = await uploader(path);
      urls.push(newpath)
      fs.unlinkSync(path)
    }
    const findBlog = await Blog.findByIdAndUpdate(id, {
      images: urls.map(file => {return file})
    }, {new:true})
    res.json(findBlog)
  } catch(err) {
    throw new Error(err)
  }

})
module.exports = {
    createBlog,
    updateBlog,
    getBlog,
    getAllBlogs,
    deleteBlog,
    likeBlog,
    dislikeBlog,
    uploadImages
}
