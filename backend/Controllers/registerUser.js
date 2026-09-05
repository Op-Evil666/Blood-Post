const User = require("../Models/userSchema.js");
const { hashPassword } = require("../Utils/passwordUtils.js");
const { generateOtp, hashOtp } = require("../Utils/otpUtils");
const { sendVerificationEmail } = require("../Utils/emailUtils");
const AppError = require("../Utils/appError");

const registerUser = async (req, res) => {
    const { name, email, password, bio } = req.body;
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
            await sendVerificationEmail(user.email, otp);
            return res.status(201).json({
                success: true,
                message: "User registered successfully"
            });
}

module.exports = { registerUser };