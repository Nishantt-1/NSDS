const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { 
    type: String, 
    enum: ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'], 
    default: 'DRAFT' 
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  budget: { type: Number, default: 0 },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collaboratingClubs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Club' }],
  resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }]
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);