const User = require("../models/User");
const LoginOtp = require("../models/LoginOtp");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendEmail } = require("../utils/sendEmail");

// helper
function generateOtp6() {
  const n = crypto.randomInt(0, 1000000);
  return String(n).padStart(6, "0");
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, department, year } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      department,
      year,
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    return res.status(201).json({ message: "User created" });
  } catch (err) {
    // common: duplicate email unique index => E11000
    if (err?.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }
    return res.status(500).json({ message: err.message || "Server error" });
  }
};


// STEP 1: verify password, then send OTP (no cookie yet)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    // invalidate any previous unused OTPs for this user
    await LoginOtp.updateMany({ user: user._id, used: false }, { used: true });

    const otp = generateOtp6();
    const otpHash = await bcrypt.hash(otp, 10);

    const expiresMin = Number(process.env.OTP_EXPIRES_MIN || 5);
    const expiresAt = new Date(Date.now() + expiresMin * 60 * 1000);

    await LoginOtp.create({ user: user._id, otpHash, expiresAt });

    await sendEmail({
      to: user.email,
      subject: "Your login OTP",
      text: `Your OTP is ${otp}. It expires in ${expiresMin} minutes.`,
    });

    // IMPORTANT: don’t return JWT yet
    return res.json({
      step: "OTP_REQUIRED",
      message: "OTP sent to email",
      userId: user._id, // or a temporary loginId; this is simplest for now
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// STEP 2: verify OTP, then set cookie + return user
exports.verifyLoginOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    if (!userId || !otp) return res.status(400).json({ message: "userId and otp are required" });

    const otpDoc = await LoginOtp.findOne({ user: userId, used: false }).sort({ createdAt: -1 });
    if (!otpDoc) return res.status(400).json({ message: "OTP not found or already used" });

    if (otpDoc.expiresAt.getTime() < Date.now()) {
      otpDoc.used = true;
      await otpDoc.save();
      return res.status(400).json({ message: "OTP expired" });
    }

    otpDoc.attempts += 1;
    if (otpDoc.attempts > 5) {
      otpDoc.used = true;
      await otpDoc.save();
      return res.status(429).json({ message: "Too many attempts. Login again to get a new OTP." });
    }

    const ok = await bcrypt.compare(String(otp), otpDoc.otpHash);
    if (!ok) {
      await otpDoc.save();
      return res.status(401).json({ message: "Invalid OTP" });
    }

    otpDoc.used = true;
    await otpDoc.save();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    return res.json({ message: "Logged in", user: { name: user.name, role: user.role } });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};
