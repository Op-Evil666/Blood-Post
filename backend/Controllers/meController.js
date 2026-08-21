const User = require("../Models/userSchema");

const meController = async (req, res) =>{
    try{
        const user = await User.findById(req.user.userId).select("-password");
        if(!user){
            return res.status(404).json({
                success: false,
                message: "user not found"
            });
        }
        res.status(200).json({
            success: true,
            user
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports = meController;