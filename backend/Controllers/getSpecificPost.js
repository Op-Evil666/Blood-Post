const Post = require("../Models/postSchema");

const getSpecificPost = async (req, res) =>{
    const id = req.params.id;
    try{
        const post = await Post.findOne({ _id: id, status: "published" }).populate("author", "name -_id");
        if(!post){
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }
        res.status(200).json({
            success: true,
            post
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports = getSpecificPost;