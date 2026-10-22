const Comment = require("../Models/commentSchema");
const AppError = require("../Utils/appError");

const getComment = async (req, res) =>{
    const id = req.params.id;
    const commentId = req.params.commentId;
    const comment = await Comment.findOne({ _id: commentId, post: id }).populate("author", "name -_id");
    if(!comment){
        throw new AppError("Comment not found", 404);
    }
    return res.status(200).json({
        success: true,
        comment
    });
}

module.exports = getComment;