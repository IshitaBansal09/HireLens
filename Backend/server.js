require("dotenv").config()  // so that jo bhi variable hoge .env file ke ander, hm unko acess kr payege, hmare pure express server ke ander
const app = require("./src/app")
const connectToDB = require("./src/config/database")
const logger = require("./src/config/logger")

const PORT = process.env.PORT || 3000

connectToDB()

app.listen(PORT, () => {
    logger.info({ port: PORT }, "Server is running")
})

// last-resort safety nets => log anything that escapes the normal request flow
process.on("unhandledRejection", (reason) => {
    logger.error({ err: reason }, "Unhandled promise rejection")
})

process.on("uncaughtException", (err) => {
    logger.fatal({ err }, "Uncaught exception, shutting down")
    process.exit(1)
})
