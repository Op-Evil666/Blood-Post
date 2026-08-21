const Post = require("../Models/postSchema");

const getPosts = async (req, res) =>{
    const { page, limit } = req.query;
    try{
        const totalPosts = await Post.countDocuments({ status: "published" });
        if(totalPosts === 0){
            return res.status(200).json({
                success: true,
                posts: []
            });
        }
        const totalPages = Math.ceil(totalPosts/limit);
        if(page>totalPages){
          return res.status(400).json({
            success: false,
            message: "Invalid page number"
          });
        }
        const skip = (page - 1) * limit;
        const posts = await Post.find({ status: "published" }).populate("author", "name -_id").skip(skip).limit(limit);
        res.status(200).json({
            success: true,
            posts
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports = getPosts;