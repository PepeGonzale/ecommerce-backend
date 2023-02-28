const { default: mongoose } = require("mongoose")

const dbConnect = (a) => {
    try{
    const connection = mongoose.connect("mongodb+srv://PepeGonzale:hYG2WxqARYIsJWIK@cluster0.zvzqoy1.mongodb.net/ecommerce?retryWrites=true")
    .then(console.log("Db connected succesfully"))
    
    } catch(err) {
console.error(err);
    }
}

module.exports = dbConnect