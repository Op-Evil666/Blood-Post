
const Post = require("../Models/postSchema");
const Comment = require("../Models/commentSchema");
const AppError = require("../Utils/appError");

const deleteComment = async (req, res) =>{
    const id = req.params.id;
    const commentId = req.params.commentId;
    const post = await Post.findById(id);
    const isOwner = post.author.toString() === req.user.userId;
    const isAdmin = req.user.role === "admin";
    if(!isOwner && !isAdmin){
        throw new AppError("You are not authorized to delete this comment", 403);
    }
    const comment = await Comment.findOneAndDelete({ _id: commentId, post: id });
    if(!comment){
        throw new AppError("Comment not found", 404);
    }
    return res.status(204).send();
}

module.exports = deleteComment;