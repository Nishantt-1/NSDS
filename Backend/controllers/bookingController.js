const Booking = require('../models/Booking');
const Resource = require('../models/Resource');

exports.createBooking = async (req, res) => {
    const { resourceId, startTime, endTime, eventId } = req.body;

    // CONFLICT DETECTION LOGIC
    const conflict = await Booking.findOne({
        resource: resourceId,
        status: 'APPROVED',
        $or: [
            { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
        ]
    });

    if (conflict) return res.status(400).json({ message: "Slot already booked" });

    const resource = await Resource.findById(resourceId);
    const booking = await Booking.create({
        resource: resourceId,
        event: eventId,
        user: req.user.id,
        startTime, endTime,
        status: resource.isAutoApprove ? 'APPROVED' : 'PENDING'
    });
    res.status(201).json(booking);
};