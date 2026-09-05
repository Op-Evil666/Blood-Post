const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./Routes/authRoutes");
const postRoutes = require("./Routes/postRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const errorMiddleware = require("./Middlewares/errorMiddleware");
const logger = require("./Utils/logger");
const pinoHttp = require("pino-http");
const app = express();

app.use(express.json({limit: "10kb"}));
app.use(helmet());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(pinoHttp({ logger,
    redact: [
            "req.headers.authorization",
            "req.headers.cookie",
            "res.headers.set-cookie"
        ]
 }));

app.get("/", (req, res) =>{
    res.status(200).json({
        success: true,
        message: "Welcome to the Blog API"
    });
});
app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/posts", postRoutes);

app.use("/api/v1/admin", adminRoutes);

app.use(errorMiddleware);

module.exports = app;