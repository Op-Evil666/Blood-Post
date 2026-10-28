const AppError = require("../utils/appError");

const notOwnerMiddleware = (req, res, next) => {
  const role = req.user?.role;

  if (!role) {
    return next(new AppError("Authentication required", 401));
  }

  if (role === "owner") {
    return next(
      new AppError("Owner cannot perform this action", 403)
    );
  }

  next();
};

module.exports = notOwnerMiddleware;