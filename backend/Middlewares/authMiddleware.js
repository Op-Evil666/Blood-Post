const { verifyAccessToken } = require("../Utils/tokenUtils");

const authenticate = (req, res, next) =>{
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
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

module.exports = authenticate;