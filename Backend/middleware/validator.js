const Joi = require('joi');

// Reusable validation wrapper
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({ status: 'Error', messages: errors });
    }
    next();
  };
};

/** 
 * Validation Schemas per Problem Statement
 */
const schemas = {
  // User Registration
  userRegister: Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('ADMIN', 'ORGANIZER', 'PARTICIPANT').default('PARTICIPANT'),
    department: Joi.string().required(),
    year: Joi.number().integer().min(1).max(5)
  }),

  // Event Creation (Lifecycle Management)
  eventCreate: Joi.object({
    title: Joi.string().min(5).required(),
    description: Joi.string().max(500),
    startTime: Joi.date().greater('now').required(),
    endTime: Joi.date().greater(Joi.ref('startTime')).required()
      .messages({ 'date.greater': 'End time must be after start time' }),
    collaboratingClubs: Joi.array().items(Joi.string()), // Array of Club IDs
    budget: Joi.number().min(0).required()
  }),

  // Resource Management
  resourceCreate: Joi.object({
    name: Joi.string().required(),
    type: Joi.string().valid('ROOM', 'HALL', 'LAB', 'EQUIPMENT').required(),
    description: Joi.string().required(),
    capacity: Joi.number().integer().min(1),
    isAutoApprove: Joi.boolean().default(false)
  }),

  // Booking Request (Resource Booking System)
  bookingRequest: Joi.object({
    resourceId: Joi.string().required(),
    eventId: Joi.string().required(),
    startTime: Joi.date().required(),
    endTime: Joi.date().greater(Joi.ref('startTime')).required()
  })
};

module.exports = { validateRequest, schemas };
