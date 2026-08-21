const { z } = require("zod");

const postIdSchema = z.strictObject({
    id: z.string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid post ID")
});

module.exports = postIdSchema;