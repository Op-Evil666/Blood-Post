const deletePost = async (req, res) =>{
    const post = req.post;
    try{
        const deletedPost = await post.deleteOne();
        res.status(200).json({
            success: true,
            message: "Post deleted successfully",
            deletedPost
        });
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports = deletePost;