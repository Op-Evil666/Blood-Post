const user = require("../Models/userSchema");
const AppError = require("../Utils/appError");

const checkOrMakeAdmin = async (req, res) =>{
    const { role } = req.user;
    const id = req.params.id;
    if(role !== "owner"){
        throw new AppError("You are not authorized to perform this action", 403);
    }
    const adminExists = await user.findOne({ role: "admin" });
    if(adminExists){
        throw new AppError("Admin already exists", 400);
    }
    const setAdmin = await user.findByIdAndUpdate(id, { $set: { role: "admin" } }, { new: true });
    if (!setAdmin) {
        throw new AppError("User not found", 404);
    }
    return res.status(200).json({
        success: true,
        message: "Admin created successfully",
        setAdmin
    });
}

module.exports = checkOrMakeAdmin;