const User = require("../Models/userSchema");
const AppError = require("../Utils/appError");

const { hashOtp } = require("../Utils/otpUtils");

const verifyUser = async (req, res) => {
    const { otp } = req.body;
    const id = req.params.id;

    const user = await User.findById(id);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (user.isVerified) {
        throw new AppError("User is already verified", 400);
    }

    if (
        !user.verificationOtpHash ||
        !user.verificationOtpExpiresAt
    ) {
        throw new AppError("Verification OTP not found", 400);
    }

    if (user.verificationOtpExpiresAt < new Date()) {
        throw new AppError("Verification OTP expired", 400);
    }

    const hashedOtp = hashOtp(otp);

    if (hashedOtp !== user.verificationOtpHash) {
        throw new AppError("Invalid verification OTP", 400);
    }

    user.isVerified = true;
    user.verificationOtpHash = null;
    user.verificationOtpExpiresAt = null;

    await user.save();

    return res.status(200).json({
        success: true,
        message: "User verified successfully"
    });
};

module.exports = verifyUser;