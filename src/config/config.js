require('dotenv').config()
module.exports = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRE:process.env.JWT_SECRET,
    CLOUD_NAME: process.env.CLOUD_NAME,
    API_KEY_CLOUDINARY: process.env.API_KEY_CLOUDINARY,
    API_SECRET_KEY_CLOUDINARY: process.env.API_SECRET_CLOUDINARY
}