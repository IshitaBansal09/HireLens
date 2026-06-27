require("dotenv").config()  // so that jo bhi variable hoge .env file ke ander, hm unko acess kr payege, hmare pure express server ke ander
const app = require("./src/app")
const connectToDB = require("./src/config/database")
const {resume, selfDescription, jobDescription} = require("./src/services/temp")

const generateInterviewReport = require("./src/services/ai.service")

connectToDB()

generateInterviewReport({resume, selfDescription, jobDescription})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})