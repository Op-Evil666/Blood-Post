const Post = require("../Models/postSchema");
const AppError = require("../Utils/appError");

const authorizePostOrOwner = async (req, res, next) =>{
        const post = await Post.findById(req.params.id);
        if(!post){
            throw new AppError("Post not found", 404);
        }
        const isOwner = post.author.toString() === req.user.userId;
        const isAdmin = req.user.role === "admin";
        const isPublished = post.status === "published";
        const canDelete = isOwner || (isAdmin && isPublished);
        if(!canDelete){
            throw new AppError("You are not authorized to make changes", 403);
        }
        req.post = post;
        return next();
}

module.exports = authorizePostOrOwner;