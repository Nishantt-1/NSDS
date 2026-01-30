const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware: Verifies JWT and attaches User to Request
 */
const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token ; 
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

/**
 * Authorization Middleware: Checks if user role matches allowed roles
 * @param {Array} roles - e.g., ['ADMIN', 'ORGANIZER']
 */
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Forbidden: Only ${roles.join(' or ')} can perform this action` 
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };