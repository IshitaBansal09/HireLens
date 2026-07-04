const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const requestLogger = require("./middlewares/logger.middleware")
const errorHandler = require("./middlewares/error.middleware")


const app = express()

// request logging must come first so every request (and its response) is logged
app.use(requestLogger)

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5180"],
    credentials: true
}))

// require all the routes here
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

// using all the routes here
app.use("/api/auth", authRouter)  // /api/auth is the prefix, and this needs to be used, whenever we want to access any api
app.use("/api/interview", interviewRouter)

// global error handler => must be registered last, after all routes
app.use(errorHandler)

module.exports = app