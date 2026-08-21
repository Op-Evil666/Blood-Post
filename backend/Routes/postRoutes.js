const express = require("express");
const router = express.Router();
const { validate } = require("../Middlewares/schemaMiddleware");
const authenticate = require("../Middlewares/authMiddleware");
const paginationSchema = require("../Schemas/paginationSchema");
const postSchema = require("../Schemas/postSchema");
const postIdSchema = require("../Schemas/postIdSchema");
const createPost = require("../Controllers/createPost");
const getPosts = require("../Controllers/getPosts");
const getSpecificPost = require("../Controllers/getSpecificPost");

router.post("/", authenticate, validate(postSchema, "body"), createPost);
router.get("/", validate(paginationSchema, "query"),getPosts);
router.get("/:id", validate(postIdSchema, "params"), getSpecificPost);

module.exports = router;