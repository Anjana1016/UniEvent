const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { generateTokenAndSetCookieUser } = require("../utils/generateTokenAndSetCookie");

exports.registerUser = async (req, res) => {

    const { email, password, userName, contactNumber } = req.body;

    try {

        if (!email || !password || !userName || !contactNumber) {
            throw new Error("All fields are required");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const user = new User({
            email,
            password: hashedPassword,
            userName,
            contactNumber,
            isVerified: true,
        });

        await user.save();

        generateTokenAndSetCookieUser(res, user._id);

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                ...user._doc,
                password: undefined
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }

};

exports.loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isValidPassword = await bcryptjs.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        generateTokenAndSetCookieUser(res, user._id);

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred during login",
        });
    }
}

exports.logoutUser = async (req, res) => {
    res.clearCookie("userToken");
    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
}

exports.checkUserAuth = async (req, res) => {
    try {

        const userToken = req.cookies.userToken;
        if (!userToken) {
            return res.status(401).json({
                success: false,
                message: "No authentication token provided"
            });
        }

        // Verify Token
        const decoded = jwt.verify(userToken, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }

        // Find User
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error("Auth check error:", error);
        res.status(401).json({
            success: false,
            message: "Authentication failed"
        });
    }
}
