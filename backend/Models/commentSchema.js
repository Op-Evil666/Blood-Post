const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true
        },
        content: {
            type: String,
            required: true,
            trim: true,
            maxLength: 1000
        }
    },
    { timestamps: true}
);

commentSchema.index({ postId: 1, createdAt: -1 });

module.exports = mongoose.model("Comment", commentSchema);