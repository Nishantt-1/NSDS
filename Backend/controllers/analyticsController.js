const Event = require('../models/Event');
const Booking = require('../models/Booking');
const { Parser } = require('json2csv');

exports.getStats = async (req, res) => {
    const eventTrends = await Event.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
    const resourceUsage = await Booking.aggregate([{ $group: { _id: "$resource", count: { $sum: 1 } } }]);
    res.json({ eventTrends, resourceUsage });
};

exports.exportCSV = async (req, res) => {
    const events = await Event.find().populate('creator', 'name');
    const parser = new Parser({ fields: ['title', 'status', 'budget', 'creator.name'] });
    const csv = parser.parse(events);
    res.header('Content-Type', 'text/csv');
    res.attachment('campus_report.csv');
    res.send(csv);
};