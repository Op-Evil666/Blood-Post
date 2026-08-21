const { hashRefreshToken } = require("../Utils/tokenUtils");
const TokenFamily = require("../Models/tokenFamilySchema");
const { clearRefreshTokenCookie } = require("../Utils/cookieUtils");

const logout = async (req, res) =>{
    const token = req.cookies.refreshToken;
    if(!token){
        return res.status(401).json({
            success: false,
            message: "Missing token. Login first"
        });
    }
    const hashToken = hashRefreshToken(token);
    try{
    const valid = await TokenFamily.findOne({ tokenHash: hashToken }); 
    if(!valid || valid.expiresAt < Date.now() || valid.revoked){
        return res.status(401).json({
            success: false,
            message: "Invalid or revoked token"
        });
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
catch(error){
    return res.status(500).json({
        success: false,
        message: "Internal server error"
    });
}
}

module.exports = logout;