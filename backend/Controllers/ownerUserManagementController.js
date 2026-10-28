
const User = require("../Models/userSchema");

const getVerifiedUsers = async (req, res, next) => {
  try {
    // Pagination defaults
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    // Validate pagination
    if (
      !Number.isInteger(page) ||
      !Number.isInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Page must be >= 1 and limit must be between 1 and 100.",
      });
    }

    // Optional name search
    const name =
      typeof req.query.name === "string"
        ? req.query.name.trim()
        : "";

    if (
      req.query.name !== undefined &&
      (typeof req.query.name !== "string" || name.length > 50)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name search must be a string of at most 50 characters.",
      });
    }

    // Escape regex characters to treat search input literally
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Case-insensitive search, restricted to verified users
    const filter = {
      isVerified: true,
      ...(name && {
        name: new RegExp(escapedName, "i"),
      }),
    };

    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      User.find(filter)
        .select("name role isVerified createdAt lastLogin")
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        hasNextPage: page * limit < totalUsers,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getVerifiedUsers };
