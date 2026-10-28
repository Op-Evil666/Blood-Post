const express = require("express");
const router = express.Router();
const { validate } = require("../Middlewares/schemaMiddleware");
const authenticate = require("../Middlewares/authMiddleware");
const getComment = require("../Controllers/getComment");
const getPostComment = require("../Controllers/getAllCommentsPost");
const createComment = require("../Controllers/createComment");
const updateComment = require("../Controllers/updateComment");
const deleteComment = require("../Controllers/deleteComment");
const getUserComment = require("../Controllers/getAllCommentsUser");
const existPostMiddleware = require("../Middlewares/existPostMiddleware");
const { commentLimiter, apiLimiter } = require("../Middlewares/rateLimitMiddleware");
const postIdSchema = require("../Schemas/postIdSchema");
const commentParamsSchema = require("../Schemas/commentParamsSchema");

router.use(apiLimiter);
router.get("/post/:id/comments", commentLimiter, validate(postIdSchema, "params"), existPostMiddleware, getPostComment);
router.get("/user/comments", commentLimiter, authenticate, getUserComment);
router.get("/post/:id/comments/:commentId", commentLimiter, validate(commentParamsSchema, "params"), existPostMiddleware, getComment);
router.post("/post/:id/comment", commentLimiter, authenticate, validate(postIdSchema, "params"), existPostMiddleware, createComment);
router.put("/post/:id/comments/:commentId", commentLimiter, authenticate,  validate(commentParamsSchema, "params"), existPostMiddleware, updateComment);
router.delete("/post/:id/comments/:commentId", commentLimiter, authenticate, validate(commentParamsSchema, "params"), existPostMiddleware, deleteComment);

module.exports = router;
