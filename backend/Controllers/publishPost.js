const publishPost = async (req, res) =>{
    const post = req.post;
    if (post.status === "published") {
        return res.status(409).json({
            success: false,
            message: "Post is already published"
        });
    }
    try{
    post.status = "published";
    await post.save()
    res.status(200).json({
        success: true,
        message: "Post published",
        post
    });
}
catch(error){
    return res.status(500).json({
        success: false,
        message: "Internal server error"
    });
}
}

module.exports = publishPost;