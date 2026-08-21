const Post = require("../Models/postSchema");

const authorizePostMiddleware = async (req, res, next) =>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }
        if(post.author.toString() !== req.user.userId)
        {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to make changes"
            });
        }
        req.post = post;
        next();
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports = authorizePostMiddleware;