// mongoose => used to connect express server and mongodb data base
const mongoose = require("mongoose")
const logger = require("./logger")

async function connectToDB(){
    try {
        await mongoose.connect(process.env.MONGO_URI)
        logger.info("Connected to Database")
    }

    catch(err){
        // log with the error object so pino serializes the full stack trace
        logger.error({ err }, "Failed to connect to Database")
        // a server that cannot reach its database is not useful => exit so the
        // process manager can restart it instead of running in a broken state
        process.exit(1)
    }
}

module.exports = connectToDB
