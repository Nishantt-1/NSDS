const rateLimit = require("express-rate-limit");

exports.loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 5, // 5 OTP sends per IP per 10 min
  message: { message: "Too many OTP requests. Try again later." },
});

exports.otpVerifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20, // allow more verifies, still limited
  message: { message: "Too many OTP attempts. Try again later." },
});
