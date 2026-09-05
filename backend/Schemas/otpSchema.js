const { z } = require("zod");

const otpSchema = z.strictObject({
    otp: z.string().length(6, "OTP must be 6 digits").regex(/^\d+$/, "OTP must contain only digits")
});

module.exports = { otpSchema };