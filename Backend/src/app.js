const express = require("express")
const cookieParser = require("cookie-parser")


const app = express()

app.use(express.json())
app.use(cookieParser())

// require all the routes here
const authRouter = require("./routes/auth.routes")

// using all the routes here
app.use("/api/auth", authRouter)  // /api/auth is the prefix, and this needs to be used, whenever we want to access any api

module.exports = app