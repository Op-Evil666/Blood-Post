const logger = require("../Utils/logger");

const errorMiddleware = (err, req, res, next) => {

    logger.error(err);

    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        message: statusCode === 500 
        ? "Internal server error" 
        : err.message
    });
};

module.exports = errorMiddleware;