const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true,      
    },
    category:{
        type:String,
        required:true,
        
    },
    numViews:{
        type:Number,
        required:true,
        default: 0
    },
    isLiked: {
        type: Boolean,
        default: false
    },
    isDisliked: {
        type: Boolean,
        default: false
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    image: {
        type: String, 
        default: "https://imgs.search.brave.com/ZRwrutQC7QfyJ55KPfAadn-1jUMtUOLm6gVYPKASe3I/rs:fit:582:225:1/g:ce/aHR0cHM6Ly90c2Ux/Lm1tLmJpbmcubmV0/L3RoP2lkPU9JUC5V/ZkZFdEJ5SmpMRHZt/OGc0WTJIY0VRSGFH/QyZwaWQ9QXBp"
    },
    author: {
        type: String,
        default: "Admin"
    }

}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }, timestamps: true
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);