const { verifyAccessToken } = require("../Utils/tokenUtils");

const optionalAuthorize = (req, res, next) =>{
        const authHeader = req.headers.authorization;
        if(!authHeader){
            req.user = null;
            return next();
        }
        const [scheme, token] = authHeader.split(" ");
        if(scheme !== "Bearer" || !token){
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }
        try{
        const payload = verifyAccessToken(token);
        req.user = payload;
        next();
        }
        catch(error){
            return res.status(401).json({
                success: false,
                message: "Invalid or Expired token"
            });
    }
}

module.exports = optionalAuthorize;