const logger = require("../config/logger")

// global error handler => Express 5 automatically forwards rejected promises from
// async route handlers here, so any unexpected error ends up being logged (with the
// full stack via the "err" serializer) instead of silently crashing or being swallowed
function errorHandler(err, req, res, next) {
    // prefer the per-request child logger (has reqId/method/url), fall back to base logger
    const log = req.log || logger
    log.error({ err }, "unhandled error while processing request")

    // if headers were already sent, delegate to Express's default handler
    if (res.headersSent) {
        return next(err)
    }

    res.status(500).json({
        message: "Internal server error"
    })
}

module.exports = errorHandler
