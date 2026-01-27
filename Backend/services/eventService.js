const Event = require('../models/Event');
const Club = require('../models/Club');

/**
 * Creates an event and links it to all collaborating clubs
 */
const createCollaborativeEvent = async (eventData, creatorId) => {
  const event = new Event({
    ...eventData,
    creator: creatorId,
    status: 'PENDING' // Initial state after submission
  });

  const savedEvent = await event.save();

  // Update all collaborating clubs to include this event in their records
  if (eventData.collaboratingClubs && eventData.collaboratingClubs.length > 0) {
    await Club.updateMany(
      { _id: { $in: eventData.collaboratingClubs } },
      { $push: { events: savedEvent._id } }
    );
  }

  return savedEvent;
};

/**
 * Transitions event through lifecycle (Draft -> Pending -> Approved)
 */
const updateEventLifecycle = async (eventId, newStatus) => {
  const validStatuses = ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'];
  if (!validStatuses.includes(newStatus)) throw new Error('Invalid status transition');

  return await Event.findByIdAndUpdate(
    eventId, 
    { status: newStatus }, 
    { new: true }
  ).populate('creator collaboratingClubs');
};

module.exports = { createCollaborativeEvent, updateEventLifecycle };