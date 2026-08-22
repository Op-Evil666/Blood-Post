const pino = require("pino");

const logger = pino(
    {
        level: process.env.LOG_LEVEL || 'info'
    },
    pino.destination("./logs/app.log")
);

module.exports = logger;