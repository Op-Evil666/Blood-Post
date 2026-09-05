const { hashRefreshToken } = require("../Utils/tokenUtils");
const TokenFamily = require("../Models/tokenFamilySchema");
const { clearRefreshTokenCookie } = require("../Utils/cookieUtils");
const AppError = require("../Utils/appError");

const logout = async (req, res) =>{
    const token = req.cookies.refreshToken;
    if(!token){
        throw new AppError("Missing token. Login first", 401);
    }
    const hashToken = hashRefreshToken(token);
    const valid = await TokenFamily.findOne({ tokenHash: hashToken }); 
    if(!valid || valid.expiresAt < Date.now() || valid.revoked){
        throw new AppError("Invalid or revoked token", 401);
    }
    await TokenFamily.findByIdAndUpdate(valid._id,
        { revoked: true, revokedAt: new Date() }
    );
    clearRefreshTokenCookie(res);
    res.status(200).json({
        success: true,
        message: "Logout successful!"
    });

}

module.exports = logout;