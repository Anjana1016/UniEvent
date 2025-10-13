const express = require("express");
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { createEvent, getEvents, getEventById, deleteEvent } = require('../controllers/eventController');
const { verifyAdminToken } = require('../middlewares/verifyAdminToken');

// Create event with file upload
router.post('/', upload.single('eventThumbnailImage'), createEvent);

// Get all events
router.get('/', getEvents);

// Get event by ID
router.get('/:id', getEventById);

// Delete event (admin only)
router.delete('/:id', verifyAdminToken, deleteEvent);

module.exports = router;