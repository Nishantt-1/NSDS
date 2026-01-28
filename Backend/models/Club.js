const mongoose = require('mongoose');

const ClubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Club name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  logo: {
    type: String, 
    default: 'default-club-logo.png'
  },
  category: {
    type: String,
    enum: ['Technical', 'Cultural', 'Sports', 'Social', 'Academic'],
    required: true
  },
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // List of all members and their specific roles within the club
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['President', 'Vice-President', 'Coordinator', 'Member'],
      default: 'Member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Visibility control as per problem statement
  isPublic: {
    type: Boolean,
    default: true
  },
  // Track events associated specifically with this club
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  isActive: {
    type: Boolean,
    default: true // Admin can deactivate a club if needed
  },
   joinRequests: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
    requestedAt: { type: Date, default: Date.now }
  }]

}, { 
  timestamps: true // Automatically creates createdAt and updatedAt fields
});

// Indexing for faster search on club names
ClubSchema.index({ name: 'text' });

module.exports = mongoose.model('Club', ClubSchema);