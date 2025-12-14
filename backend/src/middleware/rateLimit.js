const rateLimit = require('express-rate-limit');

// General rate limiter
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});

// Strict rate limiter for auth endpoints
exports.authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    success: false,
    message: 'Too many login attempts, please try again after an hour'
  }
});

// Driver location updates rate limiter
exports.locationUpdateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit to 30 updates per minute
  message: {
    success: false,
    message: 'Too many location updates'
  }
});