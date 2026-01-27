const Booking = require('../models/Booking');
const Resource = require('../models/Resource');

/**
 * Check if a resource is available for a specific time slot
 */
const checkAvailability = async (resourceId, startTime, endTime) => {
  const overlap = await Booking.findOne({
    resource: resourceId,
    status: 'APPROVED', // Only approved bookings cause conflicts
    $or: [
      {
        startTime: { $lt: endTime },
        endTime: { $gt: startTime }
      }
    ]
  });
  return !overlap; // Returns true if available
};

/**
 * Create a booking and handle auto-approval logic
 */
const createBookingRequest = async (bookingData) => {
  const { resourceId, startTime, endTime } = bookingData;

  // 1. Check for conflicts
  const isAvailable = await checkAvailability(resourceId, startTime, endTime);
  if (!isAvailable) {
    throw new Error('The resource is already booked for this time slot.');
  }

  // 2. Determine status based on Resource config
  const resource = await Resource.findById(resourceId);
  if (!resource) throw new Error('Resource not found');
  
  const status = resource.isAutoApprove ? 'APPROVED' : 'PENDING';

  // 3. Save Booking
  const booking = new Booking({ ...bookingData, status });
  return await booking.save();
};

module.exports = { checkAvailability, createBookingRequest };