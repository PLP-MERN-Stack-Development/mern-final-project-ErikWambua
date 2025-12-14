const { body, param, query, validationResult } = require('express-validator');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const { isValidPhone, isValidPlateNumber, isValidCoordinate } = require('../utils/validators');

// Validation middleware
exports.validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: extractedErrors
    });
  };
};

// Common validators
exports.phoneValidator = body('phone')
  .trim()
  .notEmpty()
  .withMessage('Phone number is required')
  .custom(value => {
    if (!isValidPhone(value)) {
      throw new Error('Please provide a valid Kenyan phone number');
    }
    return true;
  });

exports.emailValidator = body('email')
  .optional()
  .trim()
  .isEmail()
  .withMessage('Please provide a valid email address')
  .normalizeEmail();

exports.passwordValidator = body('password')
  .trim()
  .notEmpty()
  .withMessage('Password is required')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters');

exports.nameValidator = body('name')
  .trim()
  .notEmpty()
  .withMessage('Name is required')
  .isLength({ min: 2, max: 50 })
  .withMessage('Name must be between 2 and 50 characters');

exports.coordinatesValidator = body(['coordinates', 'location.coordinates', 'currentLocation.coordinates'])
  .custom(value => {
    if (!value || !Array.isArray(value) || value.length !== 2) {
      throw new Error('Coordinates must be an array of [longitude, latitude]');
    }
    
    const [lng, lat] = value;
    if (typeof lng !== 'number' || typeof lat !== 'number') {
      throw new Error('Coordinates must be numbers');
    }
    
    if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
      throw new Error('Invalid coordinate values');
    }
    
    return true;
  });

// Authentication validators
exports.registerValidation = [
  exports.nameValidator,
  exports.phoneValidator.custom(async (value) => {
    const user = await User.findOne({ phone: value });
    if (user) {
      throw new Error('Phone number already registered');
    }
    return true;
  }),
  exports.emailValidator.custom(async (value, { req }) => {
    if (value) {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error('Email already registered');
      }
    }
    return true;
  }),
  exports.passwordValidator,
  body('role')
    .optional()
    .isIn(['passenger', 'driver', 'sacco_admin'])
    .withMessage('Invalid role')
];

exports.loginValidation = [
  exports.phoneValidator,
  exports.passwordValidator
];

exports.verifyPhoneValidation = [
  exports.phoneValidator,
  body('code')
    .trim()
    .notEmpty()
    .withMessage('Verification code is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('Verification code must be 6 digits')
    .isNumeric()
    .withMessage('Verification code must be numeric')
];

// Passenger validators
exports.routeSearchValidation = [
  query('origin')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Origin must be between 2 and 100 characters'),
  
  query('destination')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Destination must be between 2 and 100 characters'),
  
  query('near')
    .optional()
    .custom(value => {
      if (value) {
        const [lng, lat] = value.split(',').map(Number);
        if (isNaN(lng) || isNaN(lat)) {
          throw new Error('Invalid near parameter format. Use "lng,lat"');
        }
      }
      return true;
    }),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

exports.reservationValidation = [
  body('tripId')
    .notEmpty()
    .withMessage('Trip ID is required')
    .isMongoId()
    .withMessage('Invalid Trip ID format'),
  
  body('stageId')
    .notEmpty()
    .withMessage('Stage ID is required'),
  
  body('stageIndex')
    .notEmpty()
    .withMessage('Stage index is required')
    .isInt({ min: 0 })
    .withMessage('Stage index must be a positive integer'),
  
  body('paymentMethod')
    .optional()
    .isIn(['mpesa', 'cash', 'wallet'])
    .withMessage('Invalid payment method')
];

exports.alertValidation = [
  body('type')
    .notEmpty()
    .withMessage('Alert type is required')
    .isIn(['police', 'accident', 'traffic_jam', 'roadblock', 'protest', 'flooding', 'breakdown', 'other'])
    .withMessage('Invalid alert type'),
  
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  
  body('location')
    .notEmpty()
    .withMessage('Location is required')
    .custom(value => {
      if (!value.lng || !value.lat) {
        throw new Error('Location must contain lng and lat');
      }
      if (!isValidCoordinate([value.lng, value.lat])) {
        throw new Error('Invalid coordinates');
      }
      return true;
    }),
  
  body('severity')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid severity level'),
  
  body('routeIds')
    .optional()
    .isArray()
    .withMessage('Route IDs must be an array')
];

// Driver validators
exports.locationUpdateValidation = [
  body('coordinates')
    .notEmpty()
    .withMessage('Coordinates are required')
    .isArray({ min: 2, max: 2 })
    .withMessage('Coordinates must be an array of [longitude, latitude]')
    .custom(value => {
      if (!isValidCoordinate(value)) {
        throw new Error('Invalid coordinates');
      }
      return true;
    }),
  
  body('speed')
    .optional()
    .isFloat({ min: 0, max: 200 })
    .withMessage('Speed must be between 0 and 200 km/h'),
  
  body('heading')
    .optional()
    .isFloat({ min: 0, max: 360 })
    .withMessage('Heading must be between 0 and 360 degrees'),
  
  body('accuracy')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Accuracy must be a positive number')
];

exports.crowdUpdateValidation = [
  body('level')
    .notEmpty()
    .withMessage('Crowd level is required')
    .isIn(['empty', 'low', 'half', 'high', 'full', 'standing'])
    .withMessage('Invalid crowd level'),
  
  body('passengerCount')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Passenger count must be a positive integer')
];

exports.startTripValidation = [
  body('routeId')
    .notEmpty()
    .withMessage('Route ID is required')
    .isMongoId()
    .withMessage('Invalid Route ID format'),
  
  body('vehicleId')
    .notEmpty()
    .withMessage('Vehicle ID is required')
    .isMongoId()
    .withMessage('Invalid Vehicle ID format'),
  
  body('scheduledStartTime')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
    .custom(value => {
      if (new Date(value) < new Date()) {
        throw new Error('Scheduled start time cannot be in the past');
      }
      return true;
    })
];

// Sacco validators
exports.vehicleValidation = [
  body('plateNumber')
    .trim()
    .notEmpty()
    .withMessage('Plate number is required')
    .custom(value => {
      if (!isValidPlateNumber(value)) {
        throw new Error('Invalid Kenyan plate number format (e.g., KBC 123A)');
      }
      return true;
    })
    .custom(async (value, { req }) => {
      const vehicle = await Vehicle.findOne({ plateNumber: value });
      if (vehicle && (!req.params.id || vehicle._id.toString() !== req.params.id)) {
        throw new Error('Vehicle with this plate number already exists');
      }
      return true;
    }),
  
  body('make')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Make must be between 2 and 50 characters'),
  
  body('model')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Model must be between 2 and 50 characters'),
  
  body('year')
    .optional()
    .isInt({ min: 1990, max: new Date().getFullYear() + 1 })
    .withMessage(`Year must be between 1990 and ${new Date().getFullYear() + 1}`),
  
  body('color')
    .optional()
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage('Color must be between 2 and 30 characters'),
  
  body('capacity')
    .notEmpty()
    .withMessage('Capacity is required')
    .isInt({ min: 14, max: 33 })
    .withMessage('Capacity must be between 14 and 33'),
  
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array'),
  
  body('status')
    .optional()
    .isIn(['active', 'maintenance', 'offline', 'decommissioned'])
    .withMessage('Invalid vehicle status')
];

exports.routeValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Route name is required')
    .isLength({ min: 5, max: 100 })
    .withMessage('Route name must be between 5 and 100 characters'),
  
  body('nickname')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Nickname must not exceed 50 characters'),
  
  body('origin')
    .notEmpty()
    .withMessage('Origin is required')
    .custom(value => {
      if (!value.name || !value.location || !value.location.coordinates) {
        throw new Error('Origin must have name and location with coordinates');
      }
      return true;
    }),
  
  body('destination')
    .notEmpty()
    .withMessage('Destination is required')
    .custom(value => {
      if (!value.name || !value.location || !value.location.coordinates) {
        throw new Error('Destination must have name and location with coordinates');
      }
      return true;
    }),
  
  body('path')
    .optional()
    .isArray()
    .withMessage('Path must be an array of coordinates'),
  
  body('totalDistance')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Total distance must be a positive number'),
  
  body('estimatedDuration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Estimated duration must be a positive integer'),
  
  body('fareStructure.baseFare')
    .notEmpty()
    .withMessage('Base fare is required')
    .isFloat({ min: 0 })
    .withMessage('Base fare must be a positive number'),
  
  body('fareStructure.peakMultiplier')
    .optional()
    .isFloat({ min: 1 })
    .withMessage('Peak multiplier must be at least 1'),
  
  body('stages')
    .optional()
    .isArray()
    .withMessage('Stages must be an array'),
  
  body('stages.*.name')
    .notEmpty()
    .withMessage('Stage name is required'),
  
  body('stages.*.location.coordinates')
    .notEmpty()
    .withMessage('Stage coordinates are required')
    .custom(value => {
      if (!isValidCoordinate(value)) {
        throw new Error('Invalid stage coordinates');
      }
      return true;
    }),
  
  body('stages.*.sequence')
    .notEmpty()
    .withMessage('Stage sequence is required')
    .isInt({ min: 0 })
    .withMessage('Stage sequence must be a positive integer')
];

// Payment validators
exports.paymentValidation = [
  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .custom(value => {
      if (!isValidPhone(value)) {
        throw new Error('Please provide a valid Kenyan phone number');
      }
      return true;
    }),
  
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 10, max: 100000 })
    .withMessage('Amount must be between 10 and 100,000'),
  
  body('reservationId')
    .notEmpty()
    .withMessage('Reservation ID is required')
    .isMongoId()
    .withMessage('Invalid Reservation ID format')
];

// File upload validation
exports.fileUploadValidation = [
  body().custom((value, { req }) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      throw new Error('No files were uploaded');
    }
    
    const file = req.files.file || req.files.photo;
    if (!file) {
      throw new Error('File is required');
    }
    
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed');
    }
    
    return true;
  })
];

// Search validation
exports.searchValidation = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Search query must be between 2 and 100 characters'),
  
  query('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Invalid latitude'),
  
  query('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Invalid longitude'),
  
  query('radius')
    .optional()
    .isFloat({ min: 100, max: 10000 })
    .withMessage('Radius must be between 100 and 10,000 meters')
];

// Date range validation
exports.dateRangeValidation = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid start date format'),
  
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid end date format')
    .custom((value, { req }) => {
      if (req.query.startDate && new Date(value) < new Date(req.query.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    })
];

// MongoDB ID validation for params
exports.mongoIdValidation = [
  param('id')
    .notEmpty()
    .withMessage('ID is required')
    .isMongoId()
    .withMessage('Invalid ID format')
];

// Rate limiting validation
exports.rateLimitValidation = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('sort')
    .optional()
    .isIn(['asc', 'desc', 'newest', 'oldest', 'popular'])
    .withMessage('Invalid sort option'),
  
  query('orderBy')
    .optional()
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage('Invalid order by field')
];