// pino => fast, structured (JSON) logger used across the whole backend
const pino = require("pino")

// single shared logger instance, imported everywhere instead of using console.log
const logger = pino({
    // log level is configurable via env, defaults to "info" in dev and can be
    // lowered to "debug" for troubleshooting or raised to "warn"/"error" in prod
    level: process.env.LOG_LEVEL || "info",

    // never let secrets leak into logs => redact sensitive fields wherever they appear
    redact: {
        paths: [
            "req.headers.authorization",
            "req.headers.cookie",
            "password",
            "*.password",
            "token",
            "*.token",
            "user.password"
        ],
        censor: "[REDACTED]"
    },

    // include the process id and hostname on every log line for easier tracing
    base: {
        pid: process.pid
    }
})

module.exports = logger
