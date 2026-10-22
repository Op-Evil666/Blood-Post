const { logoutService } = require("../Services/authService");

const logout = async (req, res) =>{
    await logoutService(req, res);
    return res.status(200).json({
        success: true,
        message: "Logout successful!"
    });

}

module.exports = logout;