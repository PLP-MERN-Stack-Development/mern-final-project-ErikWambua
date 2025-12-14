const express = require('express');
const {
  getActiveTrips,
  getTripDetails,
  searchTrips,
  getTripsByRoute,
  getTripsByVehicle,
  getTripsByDriver,
  createScheduledTrip,
  updateTripStatus,
  addIncident,
  getTripAnalytics,
  updateTripLocation,
  getTripStatistics
} = require('../controllers/tripController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  mongoIdValidation,
  dateRangeValidation,
  searchValidation,
  coordinatesValidator
} = require('../middleware/validate');

// Public routes (with authentication)
router.use(protect);

// General trip routes
router.get('/active', getActiveTrips);
router.get('/search', searchValidation, searchTrips);
router.get('/stats', authorize('sacco_admin', 'super_admin'), getTripStatistics);

// Specific trip routes
router.get('/:id', mongoIdValidation, validate, getTripDetails);
router.get('/route/:routeId', mongoIdValidation, validate, getTripsByRoute);
router.get('/vehicle/:vehicleId', mongoIdValidation, validate, getTripsByVehicle);
router.get('/driver/:driverId', mongoIdValidation, validate, getTripsByDriver);

// Trip management (Driver/Sacco Admin)
router.post('/schedule', authorize('driver', 'sacco_admin'), createScheduledTrip);
router.put('/:id/status', mongoIdValidation, authorize('driver', 'sacco_admin'), updateTripStatus);
router.post('/:id/incidents', mongoIdValidation, authorize('driver'), addIncident);

// Trip analytics (Admin only)
router.get('/analytics/overview', authorize('sacco_admin', 'super_admin'), dateRangeValidation, getTripAnalytics);

// Admin override routes
router.put('/:id/location', mongoIdValidation, authorize('sacco_admin', 'super_admin'), updateTripLocation);

module.exports = router;