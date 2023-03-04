const { default: mongoose } = require("mongoose")
require('dotenv').config()
const dbConnect = (a) => {
    try{
    const connection = mongoose.connect(process.env.MONGODB_URI)
    .then(console.log("Db connected succesfully"))
    
    } catch(err) {
console.error(err);
    }
}

module.exports = dbConnect