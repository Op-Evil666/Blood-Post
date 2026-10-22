const Comment = require("../Models/commentSchema");

const getAllCommentPost = async (req, res) => {
  const postId = req.params.id;

  const comments = await Comment.find({ post: postId })
    .populate("author", "name")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    count: comments.length,
    data: comments,
  });
};

module.exports = getAllCommentPost;
