const resendVerificationOtpService = require("../Services/resendVerificationOtpService");

const requestVerificationOtp = async (req, res, next) => {
    try {
        const result = await resendVerificationOtpService(
            req.body.email,
            "email"
        );

        return res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = requestVerificationOtp;