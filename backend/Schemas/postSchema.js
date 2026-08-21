const { z } = require("zod");

const postSchema = z.strictObject({
    title: z.string()
    .trim()
    .min(5, "Enter a title")
    .max(100, "Title too big"),
    content: z.string()
    .trim()
    .min(10, "Enter some content"),
    category: z.string()
    .trim()
    .min(5, "Enter a category")
    .max(50, "Category too big"),
    tags: z.array(z.string()
    .trim()
    .toLowerCase())
    .min(1, "Specify atleast one tag")
    .max(10, "Max tag limit exceeded")
    .optional()
});

module.exports = postSchema;