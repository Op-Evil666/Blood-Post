const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
    windowMs: 2 * 60 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true,
    message: {
        success: false,
        message: "Too many attempts. Try again later"
    }
});

const otpLimiter = rateLimit({
    windowMs: 1 * 24 * 60 * 60 * 1000,
    limit: 5,
    message: {
        success: false,
        message: "Too many attempts. Try again later"
    }
});

const refreshLimiter = rateLimit({
    windowMs: 30 * 60 * 60 * 1000,
    limit: 10,
    message: {
        success: false,
        message: "Too many Attempts. Try agan later"
    }
});

const registerLimiter = rateLimit({
    windowMs: 2 * 60 * 60 * 1000,
    limit: 10,
    message: {
        success: false,
        message: "Too many attempts. Try again later"
    }
});

const postLimiter = rateLimit({
    windowMs: 4 * 60 * 60 * 1000,
    limit: 5,
    message: {
        success: false,
        message: "Too many attempts. Try again later"
    }
});

const adminLimiter = rateLimit({
    windowMs: 3 * 60 * 60 * 1000,
    limit: 5,
    message: {
        success: false,
        message: "Too many attempts. Try again later"
    }
});

const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 60 * 1000,
    limit: 20,
    message: {
        success: false,
        message: "Too many attempts. Try again later"
    }
});

module.exports = { loginLimiter, otpLimiter,refreshLimiter, registerLimiter, postLimiter, adminLimiter, apiLimiter };