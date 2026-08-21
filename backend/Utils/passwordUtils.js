const argon = require("argon2");

const hashPassword = async(password) =>{
    try{
        const hashedPassword = await argon.hash(password, { type: argon.argon2id });
        return hashedPassword;
    } catch(err){
        console.log("Error hashing password:", err.message);
        throw err;
    }
}

const verifyPassword = async(password, hashedPassword) =>{
    try{
        const isMatch = await argon.verify(hashedPassword, password);
        return isMatch;
    }
    catch(err){
        console.log("Error verifying password:", err.message);
        throw err;
    }
}

module.exports = { hashPassword, verifyPassword };