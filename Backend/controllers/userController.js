const User = require('../models/User');
const Club = require('../models/Club');

exports.getProfile = async (req, res) => {
    const user = await User.findById(req.user.id);
    const clubs = await Club.find({ "members.user": req.user.id });
    res.json({ user, clubs });
};