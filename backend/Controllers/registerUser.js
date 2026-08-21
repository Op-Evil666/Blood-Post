const User = require("../Models/userSchema.js");
const { hashPassword } = require("../Utils/passwordUtils.js");
const registerUser = async (req, res) => {
    const { name, email, password, bio } = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                success: false,
                message: "Please provide all details"
            });
        }
        try{
            const checkEmail = email.trim().toLowerCase();
            const existingUser = await User.findOne({ email: checkEmail });
            if(existingUser){
                return res.status(400).json({
                    success: false,
                    message: "User already exists"
                })
            }
            const hashedPassword = await hashPassword(password);
            await User.create({
                name,
                email: checkEmail,
                password: hashedPassword,
                bio
            });
            return res.status(201).json({
                success: true,
                message: "User registered successfully"
            });
        }
        catch(err){
            console.log("Error registering user:", err.message);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
}

module.exports = { registerUser };