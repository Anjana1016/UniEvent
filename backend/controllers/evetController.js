const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
    try {
        const {
            eventName,
            eventDate,
            eventTime,
            location,
            description,
            email,
            isFreeEvent,
            price
        } = req.body;

        console.log('Received data:', req.body); // Debug log

        // Validation
        if (!eventName || !eventDate || !eventTime || !location || !description || !email) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided"
            });
        }

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Event thumbnail image is required"
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address"
            });
        }

        // Parse isFreeEvent properly from FormData (it comes as string)
        const isEventFree = isFreeEvent === 'true' || isFreeEvent === true;
        
        console.log('Original isFreeEvent:', isFreeEvent, 'Parsed isEventFree:', isEventFree); // Debug log

        // If not free event, price is required
        if (!isEventFree && (!price || parseFloat(price) <= 0)) {
            return res.status(400).json({
                success: false,
                message: "Price is required for paid events and must be greater than 0"
            });
        }

        // Generate image URL
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        // Create event data
        const eventData = {
            eventName: eventName.trim(),
            eventDate: new Date(eventDate),
            eventTime: eventTime.trim(),
            location: location.trim(),
            description: description.trim(),
            email: email.trim().toLowerCase(),
            isFreeEvent: isEventFree,
            eventThumbnailImage: imageUrl
        };

        // Add price only if it's not a free event
        if (!isEventFree && price) {
            eventData.price = parseFloat(price);
        }

        console.log('Final event data:', eventData); // Debug log

        // Validate date is not in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (eventData.eventDate < today) {
            return res.status(400).json({
                success: false,
                message: "Event date cannot be in the past"
            });
        }

        const newEvent = new Event(eventData);
        await newEvent.save();

        res.status(201).json({
            success: true,
            message: "Event created successfully",
            data: newEvent
        });

    } catch (error) {
        console.error("Error creating event:", error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error while creating event"
        });
    }
};

exports.getEvents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Filter options
        const filter = {};
        
        // Filter by date (upcoming events only by default)
        const showPast = req.query.showPast === 'true';
        if (!showPast) {
            filter.eventDate = { $gte: new Date() };
        }

        // Filter by free/paid events
        if (req.query.isFree !== undefined) {
            filter.isFreeEvent = req.query.isFree === 'true';
        }

        // Search by event name or location
        if (req.query.search) {
            filter.$or = [
                { eventName: { $regex: req.query.search, $options: 'i' } },
                { location: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const events = await Event.find(filter)
            .sort({ eventDate: 1, eventTime: 1 })
            .skip(skip)
            .limit(limit);

        const total = await Event.countDocuments(filter);

        res.status(200).json({
            success: true,
            message: "Events fetched successfully",
            data: {
                events,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalEvents: total,
                    hasNextPage: page < Math.ceil(total / limit),
                    hasPrevPage: page > 1
                }
            }
        });

    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching events"
        });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Event fetched successfully",
            data: event
        });

    } catch (error) {
        console.error("Error fetching event:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid event ID"
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error while fetching event"
        });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        await Event.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Event deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting event:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid event ID"
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error while deleting event"
        });
    }
};