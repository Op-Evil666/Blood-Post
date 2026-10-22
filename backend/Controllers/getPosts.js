const Post = require("../Models/postSchema");
const AppError = require("../Utils/appError");

const getPosts = async (req, res) =>{
    const { page, limit } = req.query;
        const totalPosts = await Post.countDocuments({ status: "published" });
        if(totalPosts === 0){
            return res.status(200).json({
                success: true,
                posts: []
            });
        }
        const totalPages = Math.ceil(totalPosts/limit);
        if(page>totalPages){
          throw new AppError("Page not found", 400);
        }
        const skip = (page - 1) * limit;
        const posts = await Post.find({ status: "published" }).populate("author", "name -_id").sort({ createdAt: -1 }).skip(skip).limit(limit);
        res.status(200).json({
            success: true,
            totalPages,
            posts
        });
}

module.exports = getPosts;