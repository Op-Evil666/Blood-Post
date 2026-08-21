const Post = require("../Models/postSchema");

const authorizePostOrOwner = async (req, res, next) =>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }
        const isOwner = post.author.toString() === req.user.userId;
        const isAdmin = req.user.role === "admin";
        const isPublished = post.status === "published";
        const canDelete = isOwner || (isAdmin && isPublished);
        if(!canDelete){
            return res.status(403).json({
                success: false,
                message: "You are not authorized to make changes"
            });
        }
        req.post = post;
        next();
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports = authorizePostOrOwner;