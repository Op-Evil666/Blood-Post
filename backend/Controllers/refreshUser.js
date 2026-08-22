const { generateAccessToken, generateRefreshToken ,hashRefreshToken } = require("../Utils/tokenUtils");
const { setRefreshTokenCookie } = require("../Utils/cookieUtils");
const TokenFamily = require("../Models/tokenFamilySchema");

const refreshUser = async (req, res) =>{
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(401).json({
            success: false,
            message: "No token found"
        });
    }
    try{
    const hashedToken = hashRefreshToken(refreshToken);
    const valid = await TokenFamily.findOne({ tokenHash: hashedToken} );
    if(!valid || valid.expiresAt < Date.now() || valid.revoked){
        return res.status(401).json({
            success: false,
            message: "Expired or revoked token"
        });
    }
    const accessToken = generateAccessToken(valid.user, valid.role);
    const newToken = generateRefreshToken();
    const newHash = hashRefreshToken(newToken);
    await TokenFamily.findByIdAndUpdate(
        valid._id,
        { tokenHash: newHash });
    setRefreshTokenCookie(res, newToken);
    res.status(200).json({
        success: true,
        message: "Access token refreshed",
        accessToken
    });
}
catch(err){
    return res.status(500).json({
        success: false,
        message: "Internal server error"
    });
}
}

module.exports = refreshUser;