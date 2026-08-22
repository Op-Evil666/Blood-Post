const express = require("express");
const router = express.Router();
const { validate } = require("../Middlewares/schemaMiddleware");
const authenticate = require("../Middlewares/authMiddleware");
const optionalAuthorize  = require("../Middlewares/optionalAuthorize");
const authorizePostMiddleware = require("../Middlewares/authorizePostMiddleware");
const authorizePostOrOwner = require("../Middlewares/authorizePostOrOwner");
const { postLimiter, apiLimiter } = require("../Middlewares/rateLimitMiddleware");
const paginationSchema = require("../Schemas/paginationSchema");
const postSchema = require("../Schemas/postSchema");
const postIdSchema = require("../Schemas/postIdSchema");
const createPost = require("../Controllers/createPost");
const getPosts = require("../Controllers/getPosts");
const getSpecificPost = require("../Controllers/getSpecificPost");
const publishPost = require("../Controllers/publishPost");
const updatePost = require("../Controllers/updatePost");
const deletePost = require("../Controllers/deletePost");

router.use(apiLimiter);
router.post("/", postLimiter, authenticate, validate(postSchema, "body"), createPost);
router.get("/", validate(paginationSchema, "query"),getPosts);
router.get("/:id", optionalAuthorize, validate(postIdSchema, "params"), getSpecificPost);
router.patch("/:id/publish", postLimiter, authenticate, validate(postIdSchema, "params"), authorizePostMiddleware, publishPost);
router.put("/:id", postLimiter, authenticate, validate(postIdSchema, "params"), validate(postSchema, "body"), authorizePostMiddleware, updatePost);
router.delete("/:id", postLimiter, authenticate, validate(postIdSchema, "params"), authorizePostOrOwner, deletePost);

module.exports = router;