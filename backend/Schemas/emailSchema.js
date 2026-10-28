const { z } = require("zod");

const emailSchema = z
    .object({
        email: z
            .string()
            .trim()
            .min(1, "Email is required")
            .email("Please provide a valid email address")
            .max(254, "Email address is too long")
            .transform((email) => email.toLowerCase()),
    });

module.exports = emailSchema;