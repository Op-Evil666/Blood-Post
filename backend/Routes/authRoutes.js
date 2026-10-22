const express = require("express");
const router = express.Router();
const { registerUser } = require("../Controllers/registerUser");
const { loginUser } = require("../Controllers/loginUser");
const refreshUser = require("../Controllers/refreshUser");
const logout = require("../Controllers/logoutUser");
const verifyUser = require("../Controllers/verifyUser");
const meController = require("../Controllers/meController");
const getAllPostsUser = require("../Controllers/getAllPostsUser");
const getAllCommentsUser = require("../Controllers/getAllCommentsUser");
const deleteUser = require("../Controllers/deleteProfile");
const { validate } = require("../Middlewares/schemaMiddleware");
const authenticate = require("../Middlewares/authMiddleware");
const { registerLimiter, otpLimiter, loginLimiter, refreshLimiter, apiLimiter } = require("../Middlewares/rateLimitMiddleware");
const { registerSchema, loginSchema } = require("../Schemas/authSchema");
const { otpSchema } = require("../Schemas/otpSchema");

router.use(apiLimiter);
router.post("/register", registerLimiter, validate(registerSchema, "body"), registerUser);
router.post("/login", loginLimiter, validate(loginSchema, "body"), loginUser);
router.post("/refresh", refreshLimiter, refreshUser);
router.post("/verify-otp/:id", otpLimiter, validate(otpSchema, "body"), verifyUser);
router.post("/logout", logout);
router.get("/me", authenticate, meController);
router.get("/me/posts", authenticate, getAllPostsUser);
router.get("/me/comments", authenticate, getAllCommentsUser);
router.delete("/me", authenticate, deleteUser);

module.exports = router;