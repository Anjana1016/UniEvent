const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.verifyUserToken = async (req, res, next) => {
    try {

        let token = req.cookies?.userToken;

        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - no user token provided",
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - invalid user token format",
            });
        }

        // Verify that the user exists in the database
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - user not found",
            });
        }

        // Attach user info to request object
        req.userId = decoded.userId;
        req.user = user;

        next();

    } catch (error) {
        console.log("Error in verify user token:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - user token expired",
            });
        }

        return res.status(401).json({
            success: false,
            message: "Unauthorized - invalid user token",
        });
    }
}