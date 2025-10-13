const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const { generateTokenAndSetCookieAdmin } = require("../utils/generateTokenAndSetCookie");

exports.registerAdmin = async (req, res) => {

    const { email, password, adminName } = req.body;

    try {

        if (!email || !password || !adminName) {
            throw new Error("All fields are required");
        }

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const admin = new Admin({
            email,
            password: hashedPassword,
            adminName,
        });

        await admin.save();

        generateTokenAndSetCookieAdmin(res, admin._id);

        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            admin: {
                ...admin._doc,
                password: undefined
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }

};

exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isValidPassword = await bcryptjs.compare(password, admin.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        generateTokenAndSetCookieAdmin(res, admin._id);

        // Update last login 
        admin.lastLogin = new Date();
        await admin.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            admin: {
                ...admin._doc,
                password: undefined,
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred during login",
        });
    }
};

exports.logoutAdmin = async (req, res) => {
    res.clearCookie("adminToken");
    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
}

exports.checkAdminAuth = async (req, res) => {
    try {

        const adminToken = req.cookies.adminToken;
        if (!adminToken) {
            return res.status(401).json({
                success: false,
                message: "No authentication token provided"
            });
        }

        // Verify token
        const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }

        // Find admin
        const admin = await Admin.findById(decoded.adminId).select("-password");
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Admin not found"
            });
        }

        res.status(200).json({
            success: true,
            admin
        });

    } catch (error) {
        console.error("Auth check error:", error);
        res.status(401).json({
            success: false,
            message: "Authentication failed"
        });
    }
}
