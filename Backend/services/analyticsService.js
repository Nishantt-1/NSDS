const Event = require('../models/Event');
const Booking = require('../models/Booking');
const Resource = require('../models/Resource');

/**
 * Generates data for the Admin Dashboard
 */
const getSystemAnalytics = async () => {
  // 1. Resource Utilization Rate (Bookings per resource)
  const resourceUtilization = await Booking.aggregate([
    { $match: { status: 'APPROVED' } },
    { $group: { _id: '$resource', totalBookings: { $sum: 1 } } },
    { $sort: { totalBookings: -1 } }
  ]);

  // 2. Budget Usage Analytics
  const budgetStats = await Event.aggregate([
    { $group: { 
        _id: null, 
        totalBudgetAllocated: { $sum: "$budget" },
        avgBudgetPerEvent: { $avg: "$budget" }
    }}
  ]);

  // 3. Club Activity (Events per club)
  const clubActivity = await Event.aggregate([
    { $unwind: "$collaboratingClubs" },
    { $group: { _id: "$collaboratingClubs", eventCount: { $sum: 1 } } },
    { $sort: { eventCount: -1 } }
  ]);

  return {
    resourceUtilization,
    budgetStats: budgetStats[0] || {},
    clubActivity
  };
};

module.exports = { getSystemAnalytics };