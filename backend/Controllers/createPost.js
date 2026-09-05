const Post = require("../Models/postSchema");

const createPost = async (req, res) =>{
    const { title, content, category, tags } = req.body;
    const author = req.user.userId;
        const post = await Post.create({
            title,
            content,
            author,
            category,
            tags
        });
        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            post
        });
}

module.exports = createPost;