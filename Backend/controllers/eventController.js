const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
    const { title, collaboratingClubs, budget, startTime, endTime } = req.body;
    const event = await Event.create({
        title, collaboratingClubs, budget, startTime, endTime,
        creator: req.user.id,
        status: 'PENDING' // Moves to Admin for approval
    });
    res.status(201).json(event);
};

exports.approveEvent = async (req, res) => {
    const event = await Event.findByIdAndUpdate(req.params.id, { status: 'APPROVED' }, { new: true });
    res.json(event);
};