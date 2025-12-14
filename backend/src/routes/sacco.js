const express = require('express');
const {
  getDashboard,
  getVehicles,
  addVehicle,
  updateVehicle,
  assignDriver,
  getDrivers,
  getTrips,
  getRoutes,
  addRoute,
  removeRoute,
  sendAnnouncement,
  getRevenueAnalytics
} = require('../controllers/saccoController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// All sacco routes require authentication
router.use(protect);
router.use(authorize('sacco_admin'));

// Dashboard
router.get('/dashboard', getDashboard);

// Vehicle management
router.get('/vehicles', getVehicles);
router.post('/vehicles', addVehicle);
router.put('/vehicles/:id', updateVehicle);
router.put('/vehicles/:id/assign-driver', assignDriver);

// Driver management
router.get('/drivers', getDrivers);

// Trip management
router.get('/trips', getTrips);

// Route management
router.get('/routes', getRoutes);
router.post('/routes', addRoute);
router.delete('/routes/:id', removeRoute);

// Announcements
router.post('/announcements', sendAnnouncement);

// Analytics
router.get('/analytics/revenue', getRevenueAnalytics);

module.exports = router;