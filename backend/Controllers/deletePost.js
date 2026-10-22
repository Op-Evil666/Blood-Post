const mongoose = require("mongoose");
const Comment = require("../Models/commentSchema");

const deletePost = async (req, res) => {
    const post = req.post;

    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            await Comment.deleteMany(
                { post: post._id },
                { session }
            );

            await post.deleteOne({ session });
        });

        return res.status(200).json({
            success: true,
            message: "Post and its comments deleted successfully"
        });
    } finally {
        await session.endSession();
    }
};

module.exports = deletePost;