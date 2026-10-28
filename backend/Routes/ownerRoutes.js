const express = require("express");
const router = express.Router();
const promoteAdmin = require("../Controllers/promoteAdmin");
const demoteAdmin = require("../Controllers/demoteAdmin");
const getOwnerDashboardStats = require("../Controllers/ownerDashboardController");
const { getVerifiedUsers } = require("../Controllers/ownerUserManagementController");
const authenticate = require("../Middlewares/authMiddleware");
const { ownerMiddleware } = require("../Middlewares/ownerMiddleware");
const { validate } = require("../Middlewares/schemaMiddleware");
const { roleChangeLimiter, apiLimiter } = require("../Middlewares/rateLimitMiddleware");
const postIdSchema = require("../Schemas/postIdSchema");

router.use(apiLimiter);
router.patch("/role/:id/promote", roleChangeLimiter, authenticate, ownerMiddleware, validate(postIdSchema, "params"), promoteAdmin);
router.patch("/role/:id/demote", roleChangeLimiter, authenticate, ownerMiddleware, validate(postIdSchema, "params"), demoteAdmin);
router.get("/dashboard/stats", authenticate, ownerMiddleware, getOwnerDashboardStats);
router.get("/users", authenticate, ownerMiddleware, getVerifiedUsers);
module.exports = router;