const mongoose = require("mongoose");
const User = require("../Models/userSchema");
const AppError = require("../Utils/appError");
const { compareOtpHashes } = require("../Utils/otpUtils");

const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;

const verifyUserService = async ({ id, email, otp }) => {
    let userId = id;

    if (!userId && typeof email === "string" && email.trim()) {
        const userByEmail = await User.findOne({
            email: email.trim().toLowerCase(),
        }).select("_id");

        if (!userByEmail) {
            throw new AppError("Invalid verification request", 400);
        }

        userId = userByEmail._id;
    }

    if (!mongoose.isValidObjectId(userId)) {
        throw new AppError("Invalid verification request", 400);
    }

    if (typeof otp !== "string" || !/^\d{6}$/.test(otp)) {
        throw new AppError("Enter a valid six-digit OTP", 400);
    }

    const user = await User.findById(userId).select(
        "+verificationOtpHash +verificationOtpExpiresAt +verificationOtpAttempts +verificationOtpLockedUntil +isVerified"
    );

    if (!user) {
        throw new AppError("Invalid verification request", 400);
    }

    if (user.isVerified) {
        throw new AppError("Account is already verified", 400);
    }

    const now = new Date();

    if (
        user.verificationOtpLockedUntil &&
        user.verificationOtpLockedUntil > now
    ) {
        throw new AppError(
            "Too many attempts. Request a new OTP after the cooldown.",
            429
        );
    }

    if (
        !user.verificationOtpHash ||
        !user.verificationOtpExpiresAt ||
        user.verificationOtpExpiresAt <= now
    ) {
        throw new AppError(
            "OTP is missing or expired. Request a new one.",
            400
        );
    }

    const matches = compareOtpHashes(otp, user.verificationOtpHash);

    if (!matches) {
        const nextAttempts = (user.verificationOtpAttempts || 0) + 1;

        const update = {
            $inc: { verificationOtpAttempts: 1 },
        };

        if (nextAttempts >= MAX_ATTEMPTS) {
            update.$set = {
                verificationOtpLockedUntil: new Date(
                    Date.now() + LOCK_DURATION_MS
                ),
            };
        }

        const result = await User.updateOne(
            {
                _id: user._id,
                isVerified: false,
                verificationOtpHash: user.verificationOtpHash,
            },
            update
        );

        if (result.modifiedCount !== 1) {
            throw new AppError(
                "Verification state changed. Please try again.",
                409
            );
        }

        throw new AppError(
            nextAttempts >= MAX_ATTEMPTS
                ? "Too many incorrect attempts. Request a new OTP after the cooldown."
                : "Invalid OTP",
            nextAttempts >= MAX_ATTEMPTS ? 429 : 400
        );
    }

    const verifiedUser = await User.findOneAndUpdate(
        {
            _id: user._id,
            isVerified: false,
            verificationOtpHash: user.verificationOtpHash,
            verificationOtpExpiresAt: user.verificationOtpExpiresAt,
        },
        {
            $set: {
                isVerified: true,
                verificationOtpHash: null,
                verificationOtpExpiresAt: null,
                verificationOtpAttempts: 0,
                verificationOtpLastSentAt: null,
                verificationOtpLockedUntil: null,
            },
        },
        { returnDocument: "after" }
    );

    if (!verifiedUser) {
        throw new AppError(
            "OTP verification failed. Request a new OTP if it has expired.",
            400
        );
    }

    return {
        success: true,
        message: "User verified successfully",
    };
};

module.exports = { verifyUserService };
