const express = require('express');
const {
  getRoutes,
  getRoute,
  getRouteTrips,
  getTripETA,
  reserveSeat,
  getReservations,
  cancelReservation,
  reportAlert,
  getNearbyAlerts,
  confirmAlert,
  addFavorite,
  removeFavorite,
  getFavorites
} = require('../controllers/passengerController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// All passenger routes require authentication
router.use(protect);
router.use(authorize('passenger'));

// Route management
router.get('/routes', getRoutes);
router.get('/routes/:id', getRoute);
router.get('/routes/:id/trips', getRouteTrips);

// Trip information
router.get('/trips/:id/eta', getTripETA);

// Reservation management
router.post('/reservations', reserveSeat);
router.get('/reservations', getReservations);
router.put('/reservations/:id/cancel', cancelReservation);

// Alerts
router.post('/alerts', reportAlert);
router.get('/alerts/nearby', getNearbyAlerts);
router.post('/alerts/:id/confirm', confirmAlert);

// Favorites
router.post('/favorites', addFavorite);
router.delete('/favorites/:id', removeFavorite);
router.get('/favorites', getFavorites);

module.exports = router;