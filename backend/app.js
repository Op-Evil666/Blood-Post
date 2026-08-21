const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./Routes/authRoutes");
const postRoutes = require("./Routes/postRoutes");
const errorMiddleware = require("./Middlewares/errorMiddleware");
const app = express();

app.use(express.json({limit: "10kb"}));
app.use(helmet());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.get("/", (req, res) =>{
    res.status(200).json({
        success: true,
        message: "Welcome to the Blog API"
    });
});
app.use("/api/auth", authRoutes);

app.use("/api/posts", postRoutes);

app.use(errorMiddleware);

module.exports = app;