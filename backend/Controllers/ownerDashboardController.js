const User = require("../Models/userSchema");
const Comment = require("../Models/commentSchema");
const { getPostStats } = require("./getPostStats");

const getOwnerDashboardStats = async (req, res, next) => {
    try {
        const [
            totalUsers,
            totalVerifiedUsers,
            totalUnverifiedUsers,
            postStats,
            totalComments
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ isVerified: true }),
            User.countDocuments({ isVerified: false }),
            getPostStats(),
            Comment.countDocuments()
        ]);

        res.status(200).json({
            success: true,
            stats: {
                users: {
                    total: totalUsers,
                    verified: totalVerifiedUsers,
                    unverified: totalUnverifiedUsers
                },
                posts: postStats,
                comments: {
                    total: totalComments
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = getOwnerDashboardStats;