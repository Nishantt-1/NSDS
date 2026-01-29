const router = require("express").Router();
const auth = require("../controllers/authController");
const { loginLimiter, otpVerifyLimiter } = require("../middleware/rateLimiters");

router.post("/register", auth.register);
router.post("/login", loginLimiter, auth.login);
router.post("/login/verify-otp", otpVerifyLimiter, auth.verifyLoginOtp);
router.post("/logout", auth.logout);

module.exports = router;
