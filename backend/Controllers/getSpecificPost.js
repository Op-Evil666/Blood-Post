const Post = require("../Models/postSchema");

const getSpecificPost = async (req, res, next) =>{
    const id = req.params.id;
    try{
        const post = await Post.findOne({ _id: id }).populate("author", "name");
        if(!post){
            const error = new Error("Post not found");
            error.statusCode = 404;
            throw error;
        }
        if(post.status === "published"){
            return res.status(200).json({
                success: true,
                post
            });
        }
        if(!req.user){
            const error = new Error("Post not found");
            error.statusCode = 404;
            throw error;
        }
        if(post.author._id.toString() !== req.user.userId){
            const error = new Error("Post not found");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            success: true,
            post
        });
    }
    catch(error){
        next(error);
    }
}

module.exports = getSpecificPost;