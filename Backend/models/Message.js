// models/Message.js
const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  contextId: String, // Can be EventId or ClubId for group chats
  isGroup: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Message', MessageSchema);