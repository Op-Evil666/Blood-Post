const Comment = require("../Models/commentSchema");

const createComment = async (req, res) =>{
    const { content } = req.body;
    const id = req.params.id;
    const userId = req.user.userId;
    const comment = await Comment.create({
        author: userId,
        post: id,
        content
    });
    return res.status(201).json({
        success: true,
        message: "Comment posted successfully",
        comment
    });
}

module.exports = createComment;