const mongoose = require("mongoose");
const User = require("../Models/userSchema");
const Post = require("../Models/postSchema");
const Comment = require("../Models/commentSchema");
const TokenFamily = require("../Models/tokenFamilySchema");
const AppError = require("../Utils/appError");

const deleteProfile = async (req, res) => {
    const userId = req.user.userId;
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            const user = await User.findById(userId).session(session);
            if (!user) {
                throw new AppError("User not found", 404);
            }
            // Find all posts owned by this user.
            const posts = await Post.find(
                { author: userId },
                { _id: 1 }
            ).session(session);
            const postIds = posts.map((post) => post._id);
            // Delete comments written by this user.
            await Comment.deleteMany(
                { author: userId },
                { session }
            );
            // Delete comments belonging to the user's posts.
            if (postIds.length > 0) {
                await Comment.deleteMany(
                    { post: { $in: postIds } },
                    { session }
                );
                // Delete the user's posts.
                await Post.deleteMany(
                    { author: userId },
                    { session }
                );
            }
            // Remove all refresh-token families for this account.
            await TokenFamily.deleteMany(
                { user: userId },
                { session }
            );
            // Finally, delete the user.
            await User.deleteOne(
                { _id: userId },
                { session }
            );
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });
        return res.status(204).send();
    } finally {
        await session.endSession();
    }
};

module.exports = deleteProfile;