const User = require("../Models/userSchema.js");
const { generateAccessToken, generateRefreshToken, hashRefreshToken } = require("../Utils/tokenUtils");
const { setRefreshTokenCookie, clearRefreshTokenCookie } = require("../Utils/cookieUtils");
const UUID = require("uuid");
const TokenFamily = require("../Models/tokenFamilySchema");
const { hashPassword, verifyPassword } = require("../Utils/passwordUtils.js");
const { generateOtp, hashOtp } = require("../Utils/otpUtils");
const { sendVerificationEmail } = require("../Utils/emailUtils");
const AppError = require("../Utils/appError");

const registerService = async (registerData) => {
    const { name, email, password, bio } = registerData;
    if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string" ||
        !name.trim() ||
        !email.trim() ||
        !password
    ) {
        throw new AppError("Provide all required details", 400);
    }
    const normalizedName = name.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({
        $or: [
            { email: normalizedEmail },
            { name: normalizedName },
        ],
    });
    if (existingUser) {
        throw new AppError("Username or email is already registered", 409);
    }
    const hashedPassword = await hashPassword(password);
    let user;
    try {
        user = await User.create({
            name: normalizedName,
            email: normalizedEmail,
            password: hashedPassword,
            bio,
            isVerified: false,
            verificationOtpHash: null,
            verificationOtpExpiresAt: null,
            verificationOtpAttempts: 0,
            verificationOtpLastSentAt: null,
            verificationOtpLockedUntil: null,
        });
    } catch (error) {
        // Handle unique-index conflicts, including concurrent registrations.
        if (error.code === 11000) {
            throw new AppError(
                "Username or email is already registered",
                409
            );
        }
        throw error;
    }
    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const now = new Date();
    user.verificationOtpHash = otpHash;
    user.verificationOtpExpiresAt = new Date(
        now.getTime() + 5 * 60 * 1000
    );
    user.verificationOtpAttempts = 0;
    user.verificationOtpLastSentAt = now;
    user.verificationOtpLockedUntil = null;
    await user.save();
    try {
        await sendVerificationEmail(user.email, otp);
    } catch (error) {
        // Keep the account so the user can request another OTP.
        // Log only safe operational details, never the OTP or credentials.
        console.error("Verification email delivery failed", {
            userId: user._id.toString(),
            errorCode: error.code || "UNKNOWN",
        });
        throw new AppError(
            "Your account was created, but the verification email could not be sent. Please request another OTP.",
            503
        );
    }
    return user;
};

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