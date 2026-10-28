const { z } = require("zod");

const commentParamsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, {
    message: "Invalid post ID",
  }),

  commentId: z.string().regex(/^[0-9a-fA-F]{24}$/, {
    message: "Invalid comment ID",
  }),
});

module.exports = commentParamsSchema;