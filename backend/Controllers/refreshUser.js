const { generateAccessToken, generateRefreshToken, hashRefreshToken } = require("../Utils/tokenUtils");
const { setRefreshTokenCookie } = require("../Utils/cookieUtils");
const TokenFamily = require("../Models/tokenFamilySchema");
const AppError = require("../Utils/appError");

const refreshUser = async (req, res) => {
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
        return res.status(200).json({
            success: true,
            message: "Access token refreshed",
            accessToken
        });
}

module.exports = refreshUser;
