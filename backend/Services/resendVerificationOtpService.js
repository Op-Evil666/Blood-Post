const mongoose = require("mongoose");
const User = require("../Models/userSchema");
const AppError = require("../Utils/appError");
const { generateOtp, hashOtp } = require("../Utils/otpUtils");
const { sendVerificationEmail } = require("../Utils/emailUtils");

const OTP_TTL_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;

const GENERIC_MESSAGE =
    "If the account can be verified, a new OTP will be sent when permitted.";

const resendVerificationOtpService = async (identifier, lookupBy = "id") => {
    let existingUser;

    if (lookupBy === "email") {
        if (typeof identifier !== "string" || !identifier.trim()) {
            throw new AppError("Email is required", 400);
        }

        existingUser = await User.findOne({
            email: identifier.trim().toLowerCase(),
        }).select(
            "+verificationOtpLastSentAt " +
            "+verificationOtpLockedUntil isVerified"
        );
    } else {
        if (!mongoose.isValidObjectId(identifier)) {
            throw new AppError("Invalid verification request", 400);
        }

        existingUser = await User.findById(identifier).select(
            "+verificationOtpLastSentAt " +
            "+verificationOtpLockedUntil isVerified"
        );
    }

    if (!existingUser || existingUser.isVerified) {
        return { message: GENERIC_MESSAGE };
    }

    const now = new Date();

    if (
        existingUser.verificationOtpLockedUntil &&
        existingUser.verificationOtpLockedUntil > now
    ) {
        return { message: GENERIC_MESSAGE };
    }

    const lastSent = existingUser.verificationOtpLastSentAt;

    if (
        lastSent &&
        now.getTime() - lastSent.getTime() < RESEND_COOLDOWN_MS
    ) {
        if (lookupBy === "email") {
            return { message: GENERIC_MESSAGE };
        }

        throw new AppError(
            "Please wait before requesting another OTP.",
            429
        );
    }

    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const expiresAt = new Date(now.getTime() + OTP_TTL_MS);

    const filter = {
        _id: existingUser._id,
        isVerified: false,
        verificationOtpLastSentAt: lastSent ?? null,
        verificationOtpLockedUntil:
            existingUser.verificationOtpLockedUntil ?? null,
    };

    const user = await User.findOneAndUpdate(
        filter,
        {
            $set: {
                verificationOtpHash: otpHash,
                verificationOtpExpiresAt: expiresAt,
                verificationOtpAttempts: 0,
                verificationOtpLastSentAt: now,
                verificationOtpLockedUntil: null,
            },
        },
        { returnDocument: "after" }
    ).select("email");

    if (!user) {
        if (lookupBy === "email") {
            return { message: GENERIC_MESSAGE };
        }

        throw new AppError(
            "The verification request changed. Please try again.",
            409
        );
    }

    try {
        await sendVerificationEmail(user.email, otp);
    } catch (error) {
        await User.updateOne(
            { _id: user._id, verificationOtpHash: otpHash },
            {
                $set: {
                    verificationOtpHash: null,
                    verificationOtpExpiresAt: null,
                },
            }
        );

        console.error("Verification email delivery failed", {
            userId: user._id.toString(),
            errorCode: error.code || "UNKNOWN",
        });

        throw new AppError(
            "Unable to send the verification email. Please try again after the cooldown.",
            503
        );
    }

    return {
        message:
            lookupBy === "email"
                ? GENERIC_MESSAGE
                : "If the account can be verified, a new OTP has been sent.",
    };
};

module.exports = resendVerificationOtpService;