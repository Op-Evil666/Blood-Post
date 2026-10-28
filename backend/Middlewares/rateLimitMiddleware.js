
const rateLimit = require("express-rate-limit");

const createLimiter = ({
    windowMs,
    limit,
    message = "Too many requests. Please try again later.",
    skipSuccessfulRequests = false,
}) =>
    rateLimit({
        windowMs,
        limit,
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests,
        message: {
            success: false,
            message,
        },
    });

// 10 failed login attempts per 15 minutes per IP.
const loginLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true,
    message: "Too many failed login attempts. Please try again later.",
});

// Shared IP limit for OTP verification and resend.
// Also enforce separate per-account limits in the OTP services.
const otpLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: "Too many OTP requests or attempts. Please try again later.",
});

const resendOtpLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 3,
    message: "Too many OTP resend requests. Please try again later.",
});

// Allow for legitimate refresh retries from frontend interceptors.
const refreshLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 30,
});

// Registration: 5 attempts per hour per IP.
const registerLimiter = createLimiter({
    windowMs: 60 * 60 * 1000,
    limit: 5,
});

// Apply to write/mutation routes, not every post read.
const postLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 30,
});

// Apply to sensitive administrative operations.
const roleChangeLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 30,
});

// Apply to comment creation/deletion routes.
const commentLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 20,
});

// General API traffic, including authenticated reads.
const apiLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 300,
});

module.exports = {
    loginLimiter,
    otpLimiter,
    resendOtpLimiter,
    refreshLimiter,
    registerLimiter,
    postLimiter,
    roleChangeLimiter,
    commentLimiter,
    apiLimiter,
};
