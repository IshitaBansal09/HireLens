const logger = require("../config/logger")

// simple in-memory counter used to give every request a short, unique id, so that
// all log lines belonging to the same request can be correlated together
let requestCounter = 0

// requestLogger => attaches a per-request child logger to req.log and logs the
// lifecycle of each request (when it comes in, and when it finishes with status + duration)
function requestLogger(req, res, next) {
    const reqId = ++requestCounter
    const startTime = process.hrtime.bigint()

    // child logger => carries the request context (id, method, url) automatically,
    // so controllers can just call req.log.info(...) without repeating this info
    req.log = logger.child({
        reqId,
        method: req.method,
        url: req.originalUrl
    })

    req.log.info("incoming request")

    // "finish" fires once the response has been fully sent to the client
    res.on("finish", () => {
        const durationMs = Number(process.hrtime.bigint() - startTime) / 1e6
        const details = {
            statusCode: res.statusCode,
            durationMs: Math.round(durationMs * 100) / 100
        }

        // pick the log level based on the status code so errors are easy to spot
        if (res.statusCode >= 500) {
            req.log.error(details, "request failed")
        } else if (res.statusCode >= 400) {
            req.log.warn(details, "request completed with client error")
        } else {
            req.log.info(details, "request completed")
        }
    })

    next()
}

module.exports = requestLogger
