
const crypto = require("crypto");

const generateOtp = () => {
    return crypto.randomInt(100000, 1000000).toString();
};

const hashOtp = (otp) => {
    const secret = process.env.OTP_SECRET;

    if (!secret || secret.length < 32) {
        throw new Error("OTP_SECRET is missing or too short");
    }

    return crypto
        .createHmac("sha256", secret)
        .update(otp, "utf8")
        .digest("hex");
};

const compareOtpHashes = (submittedOtp, storedHash) => {
    if (
        typeof submittedOtp !== "string" ||
        !/^\d{6}$/.test(submittedOtp) ||
        typeof storedHash !== "string" ||
        !/^[a-f0-9]{64}$/.test(storedHash)
    ) {
        return false;
    }

    const submittedHash = Buffer.from(hashOtp(submittedOtp), "hex");
    const expectedHash = Buffer.from(storedHash, "hex");

    return crypto.timingSafeEqual(submittedHash, expectedHash);
};

module.exports = {
    generateOtp,
    hashOtp,
    compareOtpHashes,
};
