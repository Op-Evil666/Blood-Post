const Comment = require("../Models/commentSchema");

const getUserComments = async (req, res) => {
    const userId = req.user.userId;

    const comments = await Comment.find({ author: userId })
        .populate("post", "title")
        .sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        count: comments.length,
        data: comments,
    });
};

module.exports = getUserComments;