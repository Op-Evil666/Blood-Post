const { z } = require("zod");

const commentSchema = z.strictObject({
    content: z.string()
    .trim()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment too long")
});

module.exports = commentSchema;