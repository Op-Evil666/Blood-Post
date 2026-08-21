const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true,
    message: {
        success: false,
        message: "Too many attempts. Try again later"
    }
});

module.exports = loginLimiter;