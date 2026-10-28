const resendVerificationOtpService = require("../Services/resendVerificationOtpService");

const resendVerificationOtp = async (req, res) => {
    const result = await resendVerificationOtpService(req.params.id);
    return res.status(200).json({
        success: true,
        message: result.message,
    });
};

module.exports = resendVerificationOtp;
