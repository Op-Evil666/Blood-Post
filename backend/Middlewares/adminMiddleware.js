const AppError = require("../Utils/appError");
const adminMiddleware = (req, res, next) => {
    if(req.user && (req.user.role === 'admin') || (req.user.role === 'owner')){
        next();
    }
    else{
        throw new AppError("You are not authorized to perform this action", 403);
    }
}

module.exports = adminMiddleware;