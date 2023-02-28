const express = require('express')
const productRouter = require('./routes/productRoutes')
const dbConnect = require('./config/dbConnect')
const app = express()
const morgan = require('morgan')
const dotenv = require('dotenv').config({ path: __dirname + '/.env' })
const cookieParser = require('cookie-parser')
const {errorHandler, notFound } = require('./middleware/errorHandler')
console.log(process.env.PORT);
const PORT = process.env.PORT || 3000
const authRouter = require('./routes/authRoutes')
app.use(express.json())
app.use(cookieParser())
app.use(morgan())
dbConnect()
app.use("/api/user", authRouter)
app.use("/api/product", productRouter)
app.use(notFound)
app.use(errorHandler)
app.listen(PORT, () => {
    console.log(`Server is running in port: ${PORT}`);
})