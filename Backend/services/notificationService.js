const Notification = require('../models/Notification');

/**
 * Create a notification for a user (can be expanded to send emails/push)
 */
const notifyUser = async (userId, message, type) => {
  const notification = new Notification({
    recipient: userId,
    message,
    type, // e.g., 'EVENT_UPDATE', 'BOOKING_STATUS'
    read: false
  });

  return await notification.save();
};

/**
 * Send automated reminder for upcoming events (Logic for Cron Jobs)
 */
const sendEventReminders = async () => {
  // This would typically be called by a library like 'node-cron'
  // Logic: Find events starting in the next 24 hours and notify participants
  console.log("Checking for upcoming events to send reminders...");
};

module.exports = { notifyUser, sendEventReminders };