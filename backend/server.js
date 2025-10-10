const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectMongo = require("./config/DatabaseConnection");
require('dotenv').config();

// Initialize database connection
connectMongo();

const app = express();
const PORT = process.env.PORT;

// CORS configuration
app.use(
    cors({
        origin: [process.env.CORS_ORIGIN || "http://localhost:5173", "http://localhost:5174"],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// Other Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test Routes
app.get("/", (req, res) => {
    res.send("Welcome to UniEvent API");
});

app.use("/api/adminAuth", require("./routers/adminAuthRoute"));
app.use("/api/userAuth", require("./routers/userAuthRoute"));
app.use("/api/events", require("./routers/eventRoute"));
app.use("/api/admin", require("./routers/adminRoutes"));

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
