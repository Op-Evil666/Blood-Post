const { verifyPassword } = require("../Utils/passwordUtils");
const { generateAccessToken, generateRefreshToken, hashRefreshToken } = require("../Utils/tokenUtils");
const { setRefreshTokenCookie } = require("../Utils/cookieUtils");
const UUID = require("uuid");
const User = require("../Models/userSchema");
const TokenFamily = require("../Models/tokenFamilySchema");

const loginUser = async (req, res) =>{
    const { email, password } = req.body;
    try{
        const user = await User.findOne({ email }).select("+password");
        if(!user){
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        const isValidPassword = await verifyPassword(password, user.password);
        if(!isValidPassword){
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken();
        const hashedToken = hashRefreshToken(refreshToken);
        const tokenFamilyId = UUID.v4();
        await TokenFamily.create({
            user: user._id,
            role: user.role,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            tokenHash: hashedToken,
            familyId: tokenFamilyId,
            revoked: false,
            revokedAt: null
        });
        setRefreshTokenCookie(res, refreshToken);
        return res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports = { loginUser };