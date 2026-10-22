const Post = require("../Models/postSchema");

const getUserPosts = async (req, res) => {
    const userId = req.user.userId;

    const posts = await Post.find({ author: userId })
        .populate("author", "name")
        .sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        count: posts.length,
        data: posts,
    });
};

module.exports = getUserPosts;