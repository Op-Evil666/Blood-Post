const { verifyAccessToken } = require("../Utils/tokenUtils");
const AppError = require("../Utils/appError");

const optionalAuthorize = (req, res, next) =>{
        const authHeader = req.headers.authorization;
        if(!authHeader){
            req.user = null;
            return next();
        }
        const [scheme, token] = authHeader.split(" ");
        if(scheme !== "Bearer" || !token){
            throw new AppError("Invalid token", 401);
        }
        try{
        const payload = verifyAccessToken(token);
        req.user = payload;
        next();
        }
        catch(error){
            throw new AppError("Invalid or expired token", 401);
    }
}

module.exports = optionalAuthorize;