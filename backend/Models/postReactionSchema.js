const mongoose = require("mongoose");
const postReactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: null
    },
    type: {
        type: String,
        enum: ["like", "dislike"],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("PostReaction", postReactionSchema);