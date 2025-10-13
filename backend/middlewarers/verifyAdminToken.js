const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

exports.verifyAdminToken = async (req, res, next) => {
    try {
        // Check for admin token in cookies first
        let token = req.cookies?.adminToken;

        // If no cookie token, check Authorization header
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - no admin token provided",
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the decoded token has adminId (as per your token generation)
        if (!decoded.adminId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - invalid admin token format",
            });
        }

        // Verify that the admin exists in the database
        const admin = await Admin.findById(decoded.adminId).select("-password");
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - admin not found",
            });
        }

        // Attach admin info to request object
        req.adminId = decoded.adminId;
        req.admin = admin;

        next();
    } catch (error) {
        console.log("Error in verify admin token:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - admin token expired",
            });
        }

        return res.status(401).json({
            success: false,
            message: "Unauthorized - invalid admin token",
        });
    }
};

