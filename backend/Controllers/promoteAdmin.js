const User = require("../Models/userSchema");
const AppError = require("../Utils/appError");

const promoteAdmin = async (req, res) =>{
    const { role } = req.user;
    const id = req.params.id;
    if(role !== "owner"){
        throw new AppError("You are not authorized to promote users", 403);
    }
    const targetUser = await User.findById(id);
    if(!targetUser || targetUser.role !== "user"){
        throw new AppError("User not found", 404);
    }
    targetUser.role = "admin";
    await targetUser.save();
    return res.status(200).json({
        success: true,
        message: "User promoted successfully",
        targetUser
    });
}

module.exports = promoteAdmin;