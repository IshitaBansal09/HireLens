const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")


const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}))

// require all the routes here
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

// using all the routes here
app.use("/api/auth", authRouter)  // /api/auth is the prefix, and this needs to be used, whenever we want to access any api
app.use("/api/interview", interviewRouter)

module.exports = app