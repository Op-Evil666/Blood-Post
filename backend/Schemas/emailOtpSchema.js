const { z } = require("zod");

const emailOtpSchema = z.strictObject({
    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Please provide a valid email address")
        .max(254, "Email address is too long")
        .transform((email) => email.toLowerCase()),

    otp: z
        .string()
        .length(6, "OTP must be 6 digits")
        .regex(/^\d{6}$/, "OTP must contain exactly six digits"),
});

module.exports = { emailOtpSchema };