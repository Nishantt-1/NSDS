const Club = require('../models/Club');

exports.createClub = async (req, res) => {
    const club = await Club.create({ ...req.body, lead: req.user.id });
    res.status(201).json(club);
};

exports.addMember = async (req, res) => {
    const { clubId, userId, role } = req.body;
    await Club.findByIdAndUpdate(clubId, { 
        $push: { members: { user: userId, role } } 
    });
    res.json({ message: "Member added" });
};