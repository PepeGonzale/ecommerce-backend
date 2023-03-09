const cloudinary = require('cloudinary')
const config = require('../config/config')
cloudinary.config({
    cloud_name: config.CLOUD_NAME,
    api_key: config.API_KEY_CLOUDINARY,
    api_secret: config.API_SECRET_KEY_CLOUDINARY
  });


  const cloudinaryUploadImg = async (fileToUploads) => {
    return new Promise((resolve) => {
        cloudinary.uploader.upload(fileToUploads, (result) => {
        
        resolve(    {
            url: result.secure_url
        },
         {
            resource_type: "auto"
        }
        )
    })
})
  }

  module.exports = cloudinaryUploadImg