const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const generateAccessToken = (userId, role) =>{
    return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: "15m" });
}

const verifyAccessToken = (token) =>{
    return jwt.verify(token, process.env.JWT_SECRET);
}

const generateRefreshToken = () =>{
    return crypto.randomBytes(64).toString("hex");
}

const hashRefreshToken = (refreshToken) =>{
    return crypto.createHash("sha256").update(refreshToken).digest("hex");
}

module.exports = { generateAccessToken, verifyAccessToken, generateRefreshToken, hashRefreshToken };