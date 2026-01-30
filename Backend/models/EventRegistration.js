const mongoose = require("mongoose");

const EventRegistrationSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    status: { type: String, enum: ["REGISTERED", "ATTENDED", "CANCELLED"], default: "REGISTERED" }
  },
  { timestamps: true }
);

EventRegistrationSchema.index({ event: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("EventRegistration", EventRegistrationSchema);
