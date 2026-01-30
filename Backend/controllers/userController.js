const User = require("../models/User");
const Event = require("../models/Event");
const EventRegistration = require("../models/EventRegistration");

exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user._id; // from authenticate middleware

    const user = await User.findById(userId)
      .select("name email role department year clubs")
      .populate("clubs", "name category"); // clubs is a field in User [web:65]

    if (!user) return res.status(404).json({ message: "User not found" });

    const payload = { user };

    if (user.role === "PARTICIPANT") {
      const regs = await EventRegistration.find({ user: userId })
        .select("event status createdAt")
        .populate({
          path: "event", // field in EventRegistration schema (most likely)
          select: "title status startTime endTime creator collaboratingClubs",
          populate: [
            { path: "creator", select: "name email role" }, // field in Event schema
            { path: "collaboratingClubs", select: "name category" }, // field in Event schema
          ],
        }); // nested populate uses field names [web:65]

      payload.participant = {
        clubs: user.clubs,
        registrations: regs, // keep regs; frontend can use regs[i].event
      };
    }

    if (user.role === "ORGANIZER") {
      const events = await Event.find({ creator: userId })
        .select("title status startTime endTime collaboratingClubs")
        .populate("collaboratingClubs", "name category"); // [web:65]

      payload.organizer = { clubs: user.clubs, events };
    }

    if (user.role === "ADMIN") {
      const now = new Date();
      const ongoingEvents = await Event.find({
        startTime: { $lte: now },
        endTime: { $gte: now },
      }).select("title status startTime endTime creator"); // time window [web:570]

      payload.admin = { ongoingEvents };
    }

    return res.json(payload);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
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
