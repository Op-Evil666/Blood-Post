const Post = require("../Models/postSchema");
const AppError = require("../Utils/appError");

const authorizePostMiddleware = async (req, res, next) =>{
        const post = await Post.findById(req.params.id);
        if(!post){
            throw new AppError("Post not found", 404);
        }
        if(post.author.toString() !== req.user.userId)
        {
            throw new AppError("You are not authorized to perform this action", 403);
        }
        req.post = post;
        next();
}

module.exports = authorizePostMiddleware;