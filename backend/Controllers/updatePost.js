const updatePost = async (req, res) =>{
    const post = req.post;
    const { title, content, category, tags } = req.body;
    post.title = title;
    post.content = content;
    post.category = category;
    post.tags = tags;
    await post.save();
    res.status(200).json({
        success: true,
        message: "Update successful",
        post
    });
}

module.exports = updatePost;