const User = require("../Models/userSchema");
const AppError = require("../Utils/appError");

const demoteAdmin = async (req, res) =>{
    const { role } = req.user;
    const id = req.params.id;
    if(role !== "owner"){
        throw new AppError("You are not authorized to demote users", 403);
    }
    const targetUser = await User.findOneAndUpdate(
    { _id: id, role: "admin" },
    { $set: { role: "user" } },
    {
        returnDocument: "after",
        runValidators: true,
        projection: "name role isVerified createdAt"
    }
);
    if(!targetUser){
        throw new AppError("User not found", 404);
    }
    return res.status(200).json({
        success: true,
        message: "User demoted successfully",
        user: {
        id: targetUser._id,
        name: targetUser.name,
        role: targetUser.role,
        isVerified: targetUser.isVerified,
        createdAt: targetUser.createdAt
    }
    });
}

module.exports = demoteAdmin;