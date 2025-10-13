const express = require("express");
const router = express.Router();
const { getDashboardStats, getRecentEvents } = require('../controllers/adminDashboardController');
const { verifyAdminToken } = require('../middlewares/verifyAdminToken');

// Get dashboard stats (admin only)
router.get('/dashboard-stats', verifyAdminToken, getDashboardStats);

// Get recent events (admin only)
router.get('/recent-events', verifyAdminToken, getRecentEvents);

module.exports = router;
