const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const Reservation = require('../models/Reservation');
const mongoose = require('mongoose');

// @desc    Start a trip
// @route   POST /api/driver/trips/start
// @access  Private (Driver only)
exports.startTrip = async (req, res) => {
  try {
    const { routeId, vehicleId, scheduledStartTime } = req.body;

    // Verify driver is assigned to vehicle
    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      driverId: req.user.id,
      status: 'active'
    });

    if (!vehicle) {
      return res.status(403).json({
        success: false,
        message: 'You are not assigned to this vehicle or vehicle is not active'
      });
    }

    // Check if driver has active trip
    const activeTrip = await Trip.findOne({
      driverId: req.user.id,
      status: { $in: ['scheduled', 'boarding', 'active'] }
    });

    if (activeTrip) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active trip'
      });
    }

    // Create trip
    const trip = await Trip.create({
      vehicleId,
      routeId,
      driverId: req.user.id,
      saccoId: vehicle.saccoId,
      status: 'boarding',
      scheduledStartTime: scheduledStartTime || new Date(),
      currentLocation: vehicle.currentLocation,
      crowdLevel: 'empty',
      passengerCount: 0
    });

    // Update vehicle status
    vehicle.status = 'active';
    vehicle.lastActive = new Date();
    await vehicle.save();

    // Update driver status
    await User.findByIdAndUpdate(req.user.id, {
      lastActive: new Date(),
      status: 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Trip started successfully',
      data: trip
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to start trip'
    });
  }
};

// @desc    Update driver location
// @route   PUT /api/driver/trips/location
// @access  Private (Driver only)
exports.updateLocation = async (req, res) => {
  try {
    const { coordinates, speed, heading, accuracy } = req.body;
    const [lng, lat] = coordinates;

    // Get active trip
    const trip = await Trip.findOne({
      driverId: req.user.id,
      status: { $in: ['boarding', 'active'] }
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'No active trip found'
      });
    }

    // Update trip location
    trip.currentLocation = {
      type: 'Point',
      coordinates: [lng, lat],
      timestamp: new Date(),
      speed: speed || 0,
      heading: heading || 0,
      accuracy: accuracy || 10
    };

    // Update vehicle location
    await Vehicle.findByIdAndUpdate(trip.vehicleId, {
      currentLocation: trip.currentLocation,
      lastActive: new Date()
    });

    // Calculate next stage based on location
    // This would use the ETA calculation service
    // For now, we'll just save the trip
    await trip.save();

    // TODO: Broadcast location update via Socket.io

    res.status(200).json({
      success: true,
      message: 'Location updated',
      data: {
        location: trip.currentLocation,
        updatedAt: trip.updatedAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to update location'
    });
  }
};

// @desc    Update crowd level
// @route   PUT /api/driver/trips/crowd
// @access  Private (Driver only)
exports.updateCrowdLevel = async (req, res) => {
  try {
    const { level, passengerCount } = req.body;

    const trip = await Trip.findOne({
      driverId: req.user.id,
      status: { $in: ['boarding', 'active'] }
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'No active trip found'
      });
    }

    trip.crowdLevel = level;
    if (passengerCount !== undefined) {
      trip.passengerCount = passengerCount;
    }

    await trip.save();

    // TODO: Broadcast crowd level update via Socket.io

    res.status(200).json({
      success: true,
      message: 'Crowd level updated',
      data: {
        crowdLevel: trip.crowdLevel,
        passengerCount: trip.passengerCount
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to update crowd level'
    });
  }
};

// @desc    Start boarding (change from scheduled to boarding)
// @route   PUT /api/driver/trips/:id/start-boarding
// @access  Private (Driver only)
exports.startBoarding = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      driverId: req.user.id
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    if (trip.status !== 'scheduled') {
      return res.status(400).json({
        success: false,
        message: `Trip is already ${trip.status}`
      });
    }

    trip.status = 'boarding';
    trip.startTime = new Date();
    await trip.save();

    res.status(200).json({
      success: true,
      message: 'Boarding started',
      data: trip
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to start boarding'
    });
  }
};

// @desc    Start trip (change from boarding to active)
// @route   PUT /api/driver/trips/:id/start-driving
// @access  Private (Driver only)
exports.startDriving = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      driverId: req.user.id
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    if (trip.status !== 'boarding') {
      return res.status(400).json({
        success: false,
        message: `Trip must be in boarding status, currently ${trip.status}`
      });
    }

    trip.status = 'active';
    await trip.save();

    res.status(200).json({
      success: true,
      message: 'Trip is now active',
      data: trip
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to start driving'
    });
  }
};

// @desc    End trip
// @route   PUT /api/driver/trips/:id/end
// @access  Private (Driver only)
exports.endTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      driverId: req.user.id
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    if (!['boarding', 'active'].includes(trip.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot end trip in ${trip.status} status`
      });
    }

    trip.status = 'completed';
    trip.endTime = new Date();
    
    // Calculate duration in minutes
    const duration = Math.round((trip.endTime - trip.startTime) / 60000);
    trip.statistics.duration = duration;

    // Calculate average speed (simplified)
    // In production, use actual distance traveled
    const estimatedDistance = 15; // km (example)
    trip.statistics.totalDistance = estimatedDistance;
    trip.statistics.averageSpeed = estimatedDistance / (duration / 60);

    await trip.save();

    // Update vehicle status
    await Vehicle.findByIdAndUpdate(trip.vehicleId, {
      status: 'offline'
    });

    // Update driver status
    await User.findByIdAndUpdate(req.user.id, {
      lastActive: new Date()
    });

    // Mark all reservations as completed
    await Reservation.updateMany(
      {
        tripId: trip._id,
        status: { $in: ['confirmed', 'boarded'] }
      },
      {
        status: 'completed',
        completedAt: new Date()
      }
    );

    res.status(200).json({
      success: true,
      message: 'Trip ended successfully',
      data: trip
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to end trip'
    });
  }
};

// @desc    Cancel trip
// @route   PUT /api/driver/trips/:id/cancel
// @access  Private (Driver only)
exports.cancelTrip = async (req, res) => {
  try {
    const { reason } = req.body;

    const trip = await Trip.findOne({
      _id: req.params.id,
      driverId: req.user.id
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    if (!['scheduled', 'boarding'].includes(trip.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel trip in ${trip.status} status`
      });
    }

    trip.status = 'cancelled';
    trip.endTime = new Date();
    
    // Record incident if reason provided
    if (reason) {
      trip.incidents.push({
        type: 'breakdown',
        description: reason,
        location: trip.currentLocation,
        timestamp: new Date()
      });
    }

    await trip.save();

    // Update vehicle status
    await Vehicle.findByIdAndUpdate(trip.vehicleId, {
      status: 'offline'
    });

    // Cancel all pending reservations
    await Reservation.updateMany(
      {
        tripId: trip._id,
        status: { $in: ['pending', 'confirmed'] }
      },
      {
        status: 'cancelled',
        cancellationReason: 'Trip cancelled by driver'
      }
    );

    // TODO: Notify passengers about cancellation

    res.status(200).json({
      success: true,
      message: 'Trip cancelled',
      data: trip
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel trip'
    });
  }
};

// @desc    Get driver's active trips
// @route   GET /api/driver/trips/active
// @access  Private (Driver only)
exports.getActiveTrips = async (req, res) => {
  try {
    const trips = await Trip.find({
      driverId: req.user.id,
      status: { $in: ['scheduled', 'boarding', 'active'] }
    })
      .populate('routeId', 'name origin destination')
      .populate('vehicleId', 'plateNumber capacity')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: trips.length,
      data: trips
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active trips'
    });
  }
};

// @desc    Get driver's trip history
// @route   GET /api/driver/trips/history
// @access  Private (Driver only)
exports.getTripHistory = async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      page = 1, 
      limit = 20 
    } = req.query;

    const query = {
      driverId: req.user.id,
      status: { $in: ['completed', 'cancelled'] }
    };

    // Date filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const trips = await Trip.find(query)
      .populate('routeId', 'name')
      .populate('vehicleId', 'plateNumber')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Trip.countDocuments(query);

    // Calculate earnings
    const completedTrips = await Trip.find({
      driverId: req.user.id,
      status: 'completed',
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 30))
      }
    });

    const totalEarnings = completedTrips.reduce((sum, trip) => sum + (trip.revenue || 0), 0);
    const totalTrips = completedTrips.length;
    const averageEarnings = totalTrips > 0 ? totalEarnings / totalTrips : 0;

    res.status(200).json({
      success: true,
      count: trips.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      earnings: {
        total: totalEarnings,
        average: averageEarnings,
        trips: totalTrips
      },
      data: trips
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trip history'
    });
  }
};

// @desc    Get reservations for current trip
// @route   GET /api/driver/trips/:id/reservations
// @access  Private (Driver only)
exports.getTripReservations = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      driverId: req.user.id
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    const reservations = await Reservation.find({
      tripId: trip._id,
      status: { $in: ['confirmed', 'boarded'] }
    })
      .populate('passengerId', 'name phone')
      .sort({ stageIndex: 1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reservations'
    });
  }
};

// @desc    Mark passenger as boarded
// @route   PUT /api/driver/reservations/:id/board
// @access  Private (Driver only)
exports.markBoarded = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('tripId');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // Verify driver owns the trip
    if (reservation.tripId.driverId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (reservation.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: `Reservation is ${reservation.status}, cannot mark as boarded`
      });
    }

    reservation.status = 'boarded';
    reservation.boardedAt = new Date();
    await reservation.save();

    res.status(200).json({
      success: true,
      message: 'Passenger marked as boarded',
      data: reservation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to update boarding status'
    });
  }
};

// @desc    Update driver status (online/offline)
// @route   PUT /api/driver/status
// @access  Private (Driver only)
exports.updateStatus = async (req, res) => {
  try {
    const { status, vehicleId } = req.body;

    const driver = await User.findById(req.user.id);

    // If going online, verify vehicle assignment
    if (status === 'active' && vehicleId) {
      const vehicle = await Vehicle.findOne({
        _id: vehicleId,
        driverId: req.user.id
      });

      if (!vehicle) {
        return res.status(403).json({
          success: false,
          message: 'You are not assigned to this vehicle'
        });
      }

      // Update vehicle status
      vehicle.status = 'active';
      vehicle.lastActive = new Date();
      await vehicle.save();
    }

    // Update driver status
    driver.status = status;
    driver.lastActive = new Date();
    await driver.save();

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      data: {
        status: driver.status,
        lastActive: driver.lastActive
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to update status'
    });
  }
};

// @desc    Get driver dashboard stats
// @route   GET /api/driver/dashboard
// @access  Private (Driver only)
exports.getDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    // Today's trips
    const todaysTrips = await Trip.find({
      driverId: req.user.id,
      createdAt: { $gte: today },
      status: 'completed'
    });

    // Weekly trips
    const weeklyTrips = await Trip.find({
      driverId: req.user.id,
      createdAt: { $gte: lastWeek },
      status: 'completed'
    });

    // Active trip
    const activeTrip = await Trip.findOne({
      driverId: req.user.id,
      status: { $in: ['boarding', 'active'] }
    })
      .populate('routeId', 'name')
      .populate('vehicleId', 'plateNumber capacity');

    // Calculate statistics
    const todayStats = {
      trips: todaysTrips.length,
      earnings: todaysTrips.reduce((sum, trip) => sum + (trip.revenue || 0), 0),
      passengers: todaysTrips.reduce((sum, trip) => sum + (trip.passengerCount || 0), 0),
      distance: todaysTrips.reduce((sum, trip) => sum + (trip.statistics.totalDistance || 0), 0)
    };

    const weeklyStats = {
      trips: weeklyTrips.length,
      earnings: weeklyTrips.reduce((sum, trip) => sum + (trip.revenue || 0), 0),
      passengers: weeklyTrips.reduce((sum, trip) => sum + (trip.passengerCount || 0), 0),
      distance: weeklyTrips.reduce((sum, trip) => sum + (trip.statistics.totalDistance || 0), 0)
    };

    // Get driver's vehicle
    const vehicle = await Vehicle.findOne({ driverId: req.user.id });

    res.status(200).json({
      success: true,
      data: {
        today: todayStats,
        week: weeklyStats,
        activeTrip,
        vehicle,
        driverStatus: req.user.status
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
};