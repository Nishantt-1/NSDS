const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Resource name is required'],
    unique: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['ROOM', 'LAB', 'HALL', 'EQUIPMENT', 'VEHICLE'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String, // Room number or Block name
    required: function() { return this.type !== 'EQUIPMENT'; } 
  },
  capacity: {
    type: Number, // For rooms/halls, how many people can it hold?
    default: null
  },
  // Auto-approval logic requested in Problem Statement
  isAutoApprove: {
    type: Boolean,
    default: false // If false, Admin must approve the booking manually
  },
  // Technical details (e.g., "HDMI cable included", "4K Resolution")
  specifications: [String],
  
  status: {
    type: String,
    enum: ['AVAILABLE', 'MAINTENANCE', 'RETIRED'],
    default: 'AVAILABLE'
  },
  // Tracks which department/committee owns this resource
  ownerDepartment: {
    type: String,
    required: true
  },
  // Usage tracking for analytics (how many times it has been used)
  usageCount: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true 
});

// Virtual field to get all active bookings for this resource
ResourceSchema.virtual('activeBookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'resource'
});

module.exports = mongoose.model('Resource', ResourceSchema);