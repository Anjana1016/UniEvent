const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true,
    },
    eventDate: {
        type: Date,
        required: true,
    },
    eventTime: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    isFreeEvent: {
        type: Boolean,
        default: false,
    },
    price: {
        type: Number,
        required: function () {
            return !this.isFreeEvent;
        },
    },
    eventThumbnailImage: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);