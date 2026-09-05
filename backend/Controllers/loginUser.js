const { verifyPassword } = require("../Utils/passwordUtils");
const { generateAccessToken, generateRefreshToken, hashRefreshToken } = require("../Utils/tokenUtils");
const { setRefreshTokenCookie } = require("../Utils/cookieUtils");
const UUID = require("uuid");
const User = require("../Models/userSchema");
const TokenFamily = require("../Models/tokenFamilySchema");
const AppError = require("../Utils/appError");

const loginUser = async (req, res) =>{
    const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");
        if(!user){
            throw new AppError("Invalid credentials", 401);
        }
        if(!user.isVerified){
            throw new AppError("Please verify your email before logging in", 401);
        }
        const isValidPassword = await verifyPassword(password, user.password);
        if(!isValidPassword){
            throw new AppError("Invalid credentials", 401);
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
        user.lastLogin = new Date();
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken
        });
}

module.exports = { loginUser };