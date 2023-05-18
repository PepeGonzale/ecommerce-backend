const { default: mongoose } = require("mongoose")
const config = require('./config')

const dbConnect = async (a) => {
    console.log(config.MONGODB_URI)
    try{
    const connection = await mongoose.connect(config.MONGODB_URI)
    .then(console.log("Db connected succesfully"))
    
    } catch(err) {
console.error(err);
    }
}

module.exports = dbConnect