const Post = require("../Models/postSchema");

const getSpecificPost = async (req, res, next) =>{
    const id = req.params.id;
    try{
        const post = await Post.findOne({ _id: id, status: "published" }).populate("author", "name -_id");
        if(!post){
            throw new Error("Post not found");
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