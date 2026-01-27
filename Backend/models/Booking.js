const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'CANCELLED'], default: 'PENDING' }
});

module.exports = mongoose.model('Booking', BookingSchema);