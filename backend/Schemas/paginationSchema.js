const { z } = require("zod");

const paginationSchema = z.strictObject({
    page: z.coerce.number()
    .min(1, "Specify valid page"),
    limit: z.coerce.number()
    .min(1, "Provide valid limit")
    .max(10, "Limit exceeded") 
});

module.exports = paginationSchema;