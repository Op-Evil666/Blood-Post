
const pino = require("pino");
const path = require("path");
const fs = require("fs");

const isProduction = process.env.NODE_ENV === "production";

let destination;

if (isProduction) {
    // Render captures stdout/stderr and exposes logs in its dashboard.
    destination = pino.destination(1);
} else {
    // Ensure the local logs directory exists before writing to the file.
    const logsDirectory = path.join(__dirname, "../logs");

    fs.mkdirSync(logsDirectory, { recursive: true });

    destination = pino.destination(
        path.join(logsDirectory, "app.log")
    );
}

const logger = pino(
    {
        level: process.env.LOG_LEVEL || "info"
    },
    destination
);

module.exports = logger;
