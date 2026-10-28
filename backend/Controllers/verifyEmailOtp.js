const { verifyUserService } = require("../Services/verifyUserService");

const verifyEmailOtp = async (req, res) => {
    const { email, otp } = req.body;

    const result = await verifyUserService({
        email,
        otp,
    });

    return res.status(200).json(result);
};

module.exports = verifyEmailOtp;