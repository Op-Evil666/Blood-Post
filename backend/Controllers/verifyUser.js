const { verifyUserService } = require("../Services/verifyUserService");

const verifyUser = async (req, res) => {
    const { otp } = req.body;
    const { id } = req.params;

    const result = await verifyUserService({ id, otp });

    return res.status(200).json(result);
};

module.exports = verifyUser;