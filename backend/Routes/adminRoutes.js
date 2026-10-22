const express = require("express");
const router = express.Router();
const promoteAdmin = require("../Controllers/promoteAdmin");
const demoteAdmin = require("../Controllers/demoteAdmin");
const authenticate = require("../Middlewares/authMiddleware");
const { validate } = require("../Middlewares/schemaMiddleware");
const { adminLimiter, apiLimiter } = require("../Middlewares/rateLimitMiddleware");
const postIdSchema = require("../Schemas/postIdSchema");

router.use(apiLimiter);
router.patch("/:id/promote", adminLimiter, authenticate, validate(postIdSchema, "params"), promoteAdmin);
router.patch("/:id/demote", adminLimiter, authenticate, validate(postIdSchema, "params"), demoteAdmin);

module.exports = router;