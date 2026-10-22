const User = require("../Models/userSchema.js");
const { generateAccessToken, generateRefreshToken, hashRefreshToken } = require("../Utils/tokenUtils");
const { setRefreshTokenCookie, clearRefreshTokenCookie } = require("../Utils/cookieUtils");
const UUID = require("uuid");
const TokenFamily = require("../Models/tokenFamilySchema");
const { hashPassword, verifyPassword } = require("../Utils/passwordUtils.js");
const { generateOtp, hashOtp } = require("../Utils/otpUtils");
const AppError = require("../Utils/appError");

const registerService = async (registerData) =>{
    const { name, email, password, bio } = registerData;
        if(!name || !email || !password){
            throw new AppError("Provide all details", 400);
        }
            const checkEmail = email.trim().toLowerCase();
            const existingUser = await User.findOne({ email: checkEmail });
            if(existingUser){
                throw new AppError("User already exists", 400);
            }
            const hashedPassword = await hashPassword(password);
            const user =await User.create({
                name,
                email: checkEmail,
                password: hashedPassword,
                bio
            });
            const otp = generateOtp();
            const otpHash = hashOtp(otp);
            user.verificationOtpHash = otpHash;
            user.verificationOtpExpiresAt = new Date( Date.now() + 5 * 60 * 1000);
            await user.save();
            return user;
}

const loginService = async (loginData, res) =>{
    const { password } = loginData;
    const identifier = loginData.identifier.trim();
    const isEmail = identifier.includes("@");
    const user = await User.findOne(
        isEmail
        ? { email: identifier.toLowerCase() }
        : { name: identifier }
    ).select("+password");
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
            return accessToken;
}

const logoutService = async (req, res) =>{
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
}

const refreshService = async (req, res) =>{
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError("No token found", 401);
    }
        const hashedToken = hashRefreshToken(refreshToken);
        const tokenDoc = await TokenFamily.findOne({ $or: [{ tokenHash: hashedToken }, { pastTokenHashes: hashedToken}]}).populate("user");
        if (!tokenDoc) {
            throw new AppError("Invalid token", 401);
        }
        const isReusedToken = tokenDoc.pastTokenHashes.includes(hashedToken);
        if (isReusedToken) {
        tokenDoc.revoked = true;
        tokenDoc.revokedAt = new Date();
        await tokenDoc.save();
        throw new AppError("Refresh token reuse detected", 401);
    }

        if (tokenDoc.revoked || tokenDoc.expiresAt < Date.now()) {
            throw new AppError("Expired or revoked token", 401);
        }

        const liveUser = tokenDoc.user;
        if (!liveUser) {
            throw new AppError("User no longer exists", 401);
        }
        const pastTokenHashes = [...tokenDoc.pastTokenHashes];
        pastTokenHashes.unshift(hashedToken);
        if (pastTokenHashes.length > 5) {
            pastTokenHashes.pop();
        }

        const accessToken = generateAccessToken(liveUser._id.toString(), liveUser.role);
        const newToken = generateRefreshToken();
        const newHash = hashRefreshToken(newToken);

        await TokenFamily.findByIdAndUpdate(
            tokenDoc._id,
            { 
                tokenHash: newHash,
                role: liveUser.role,
                pastTokenHashes
            }
        );
        setRefreshTokenCookie(res, newToken);
        return accessToken;
}

module.exports = { registerService, loginService, logoutService, refreshService };