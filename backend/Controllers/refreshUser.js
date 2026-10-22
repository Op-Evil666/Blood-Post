const { refreshService } = require("../Services/authService");

const refreshUser = async (req, res) => {
    const accessToken = await refreshService(req, res);
    return res.status(200).json({
        success: true,
        message: "Access token refreshed",
        accessToken
    });
}

module.exports = refreshUser;
