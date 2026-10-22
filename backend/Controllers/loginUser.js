const { loginService } = require("../Services/authService");

const loginUser = async (req, res) =>{
    const accessToken = await loginService(req.body, res);
    return res.status(200).json({
        success: true,
        message: "Login successful",
        accessToken
    });
}

module.exports = { loginUser };