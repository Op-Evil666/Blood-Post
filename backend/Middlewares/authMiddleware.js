const { verifyAccessToken } = require("../Utils/tokenUtils");
const AppError = require("../Utils/appError");

const authenticate = (req, res, next) =>{
        const authHeader = req.headers.authorization;
        if(!authHeader){
            throw new AppError("No token found", 401);
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
            throw new AppError("Invalid or Expired token", 401);
        }
}

module.exports = authenticate;