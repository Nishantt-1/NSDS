const User = require('../models/User');
const Club = require('../models/Club');

exports.getProfile = async (req, res) => {
    const user = await User.findById(req.user.id);
    const clubs = await Club.find({ "members.user": req.user.id });
    res.json({ user, clubs });
};


exports.requestToJoinClub = async (req, res) => {
  try {
    const { userId, clubId } = req.body;

    if (!userId || !clubId) {
      return res.status(400).json({ message: "userId and clubId are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(clubId)) {
      return res.status(400).json({ message: "Invalid userId or clubId" });
    }

    const club = await Club.findById(clubId);
    if (!club) return res.status(404).json({ message: "Club not found" });

    // Already a member?
    const isMember = club.members.some(m => m.user?.toString() === userId);
    if (isMember) return res.status(409).json({ message: "Already a member" });

    // Already requested?
    const alreadyRequested = (club.joinRequests || []).some(
      r => r.user?.toString() === userId && r.status === "PENDING"
    );
    if (alreadyRequested) return res.status(409).json({ message: "Request already pending" });

    club.joinRequests = club.joinRequests || [];
    club.joinRequests.push({ user: userId, status: "PENDING" });
    await club.save();

    return res.status(201).json({ message: "Join request created" });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};
