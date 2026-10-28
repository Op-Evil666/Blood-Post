const Post = require("../Models/postSchema");

const getPostStats = async () => {
    const [
        totalPosts,
        totalPublishedPosts,
        totalDraftPosts
    ] = await Promise.all([
        Post.countDocuments(),
        Post.countDocuments({ status: "published" }),
        Post.countDocuments({ status: "draft" })
    ]);

    return {
        totalPosts,
        totalPublishedPosts,
        totalDraftPosts
    };
};

module.exports = { getPostStats };