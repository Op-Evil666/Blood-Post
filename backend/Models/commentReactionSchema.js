const mongoose = require("mongoose");
const commentReactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: null
    },
    type: {
        type: String,
        enum: ["like", "dislike"],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("CommentReaction", commentReactionSchema);