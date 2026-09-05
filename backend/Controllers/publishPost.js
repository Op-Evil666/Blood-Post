const AppError = require("../Utils/appError");

const publishPost = async (req, res) =>{
    const post = req.post;
    if (post.status === "published") {
        throw new AppError("Post is already published", 400);
    }
    post.status = "published";
    await post.save()
    res.status(200).json({
        success: true,
        message: "Post published",
        post
    });
}

module.exports = publishPost;