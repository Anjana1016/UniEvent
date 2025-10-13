const User = require('../models/User');
const Event = require('../models/Event');

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
    try {
        const totalEvents = await Event.countDocuments();
        const totalUsers = await User.countDocuments();
        const freeEvents = await Event.countDocuments({ isFreeEvent: true });
        const paidEvents = await Event.countDocuments({ isFreeEvent: false });
        
        // Get events for current month
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const eventsThisMonth = await Event.countDocuments({
            createdAt: { $gte: firstDayOfMonth }
        });

        res.status(200).json({
            success: true,
            data: {
                totalEvents,
                totalUsers,
                freeEvents,
                paidEvents,
                eventsThisMonth
            }
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics'
        });
    }
};

// Get recent events for admin dashboard
exports.getRecentEvents = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        
        const events = await Event.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('eventName eventDate eventTime location isFreeEvent price eventThumbnailImage createdAt');

        res.status(200).json({
            success: true,
            data: {
                events
            }
        });
    } catch (error) {
        console.error('Get recent events error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recent events'
        });
    }
};