const Post = require("../Models/postSchema");
const AppError = require("../Utils/appError");

const existPostMiddleware = async (req, res, next) =>{
    const id = req.params.id;
    const post = await Post.findById(id);
    if(!post || post.status !== "published"){
        throw new AppError("Post Not Found", 404);
    }
    req.post = post;
    next();
}

module.exports = existPostMiddleware;