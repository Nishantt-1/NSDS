const Message = require('../models/Message');

exports.getEventChat = async (req, res) => {
    // Context-aware: only gets messages for a specific event
    const messages = await Message.find({ contextId: req.params.eventId })
        .populate('sender', 'name')
        .sort('timestamp');
    res.json(messages);
};

exports.sendMessage = async (req, res) => {
    const message = await Message.create({
        sender: req.user.id,
        content: req.body.content,
        contextId: req.body.eventId,
        isGroup: true
    });
    res.status(201).json(message);
};