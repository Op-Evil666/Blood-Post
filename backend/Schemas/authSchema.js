const { z } = require("zod");

const registerSchema = z.object({
    name: z.string()
    .trim()
    .min(2, "Name must be atleast 2 characters long")
    .max(50, "Name must be less than 50 characters long"),
    email: z.email()
    .trim()
    .toLowerCase(),
    password: z.string()
    .min(8, "Password must be atleast 8 characters long")
    .max(50, "Password must be less than 50 characters long"),
    confirmPassword: z.string()
    .min(8, "Confirm password must be atleast 8 characters long")
    .max(50, "Confirm password must be less than 50 characters long"),
    bio: z.string()
    .trim()
    .max(200, "Bio must be less than 200 characters long")
    .optional()
})
.strict()
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

const loginSchema = z.object({
    identifier: z.string()
        .trim()
        .min(1, "Email or username is required")
        .toLowerCase(),

    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .max(50, "Password must be less than 50 characters long")
}).strict();

module.exports = { registerSchema, loginSchema };