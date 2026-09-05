const Post = require("../Models/postSchema");
const AppError = require("../Utils/appError");

const getSpecificPost = async (req, res, next) =>{
    const id = req.params.id;
        const post = await Post.findOne({ _id: id }).populate("author", "name");
        if(!post){
            throw new AppError("Post not found", 404);
        }
        if(post.status === "published"){
            return res.status(200).json({
                success: true,
                post
            });
        }
        if(!req.user){
            throw new AppError("Post not found", 404);
        }
        if(post.author._id.toString() !== req.user.userId){
            throw new AppError("Post not found", 404);
        }
        res.status(200).json({
            success: true,
            post
        });
}

module.exports = getSpecificPost;