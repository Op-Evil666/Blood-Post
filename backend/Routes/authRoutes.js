const express = require("express");
const router = express.Router();
const { registerUser } = require("../Controllers/registerUser");
const { loginUser } = require("../Controllers/loginUser");
const refreshUser = require("../Controllers/refreshUser");
const logout = require("../Controllers/logoutUser");
const meController = require("../Controllers/meController");
const { validate } = require("../Middlewares/schemaMiddleware");
const authenticate = require("../Middlewares/authMiddleware");
const loginLimiter = require("../Middlewares/rateLimitMiddleware");
const { registerSchema, loginSchema } = require("../Schemas/authSchema");

router.post("/register", validate(registerSchema, "body"), registerUser);
router.post("/login", loginLimiter, validate(loginSchema, "body"), loginUser);
router.post("/refresh", refreshUser);
router.post("/logout", logout);
router.get("/me", authenticate, meController);

module.exports = router;