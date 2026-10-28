
const nodemailer = require("nodemailer");

const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM,
} = process.env;

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    throw new Error("SMTP configuration is incomplete");
}

const port = Number(SMTP_PORT);

if (![465, 587].includes(port)) {
    throw new Error("SMTP_PORT must be 465 or 587");
}

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
});

const sendVerificationEmail = async (email, otp) => {
    return transporter.sendMail({
        from: {
            name: "Blood Post",
            address: SMTP_FROM,
        },
        to: email,
        subject: "Verify your Blood Post account",
        text:
            `Your Blood Post verification code is ${otp}.\n\n` +
            "It expires in 5 minutes. If you did not request this, ignore this email.",
    });
};

module.exports = {
    sendVerificationEmail,
    transporter,
};
