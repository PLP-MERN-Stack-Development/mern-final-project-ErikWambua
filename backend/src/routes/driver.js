const express = require('express');
const {
  startTrip,
  updateLocation,
  updateCrowdLevel,
  startBoarding,
  startDriving,
  endTrip,
  cancelTrip,
  getActiveTrips,
  getTripHistory,
  getTripReservations,
  markBoarded,
  updateStatus,
  getDashboard
} = require('../controllers/driverController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// All driver routes require authentication
router.use(protect);
router.use(authorize('driver'));

// Trip management
router.post('/trips/start', startTrip);
router.put('/trips/location', updateLocation);
router.put('/trips/crowd', updateCrowdLevel);
router.put('/trips/:id/start-boarding', startBoarding);
router.put('/trips/:id/start-driving', startDriving);
router.put('/trips/:id/end', endTrip);
router.put('/trips/:id/cancel', cancelTrip);

// Trip information
router.get('/trips/active', getActiveTrips);
router.get('/trips/history', getTripHistory);
router.get('/trips/:id/reservations', getTripReservations);

// Passenger management
router.put('/reservations/:id/board', markBoarded);

// Driver status
router.put('/status', updateStatus);

// Dashboard
router.get('/dashboard', getDashboard);

module.exports = router;