const Comment = require("../Models/commentSchema");
const AppError = require("../Utils/appError");

const updateComment = async (req, res) =>{
    const { content } = req.body;
    const id = req.params.id
    const commentId = req.params.commentId;
    const userId = req.user.userId;
    const comment = await Comment.findOne({ _id: commentId, post: id });
    if(!comment){
        throw new AppError("Comment not found", 404);
    }
    if(comment.author.toString()!== userId.toString()){
        throw new AppError("Not authorized to modify comment", 403);
    }
    const updatedComment = await Comment.findOneAndUpdate({ _id: commentId, post: id}, { $set: {content}}, { new: true, runValidators: true });
    return res.status(200).json({
        success: true, message: "Comment updated successfully",updatedComment
    });
}

module.exports = updateComment;