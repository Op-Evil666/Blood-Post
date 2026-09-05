const deletePost = async (req, res) =>{
    const post = req.post;
        const deletedPost = await post.deleteOne();
        res.status(200).json({
            success: true,
            message: "Post deleted successfully",
            deletedPost
        });
}

module.exports = deletePost;