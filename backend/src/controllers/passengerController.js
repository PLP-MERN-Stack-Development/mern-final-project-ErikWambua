const Route = require('../models/Route');
const Trip = require('../models/Trip');
const Reservation = require('../models/Reservation');
const Alert = require('../models/Alert');
const User = require('../models/User');
const mongoose = require('mongoose');
const geolib = require('geolib');

// @desc    Get all routes
// @route   GET /api/passenger/routes
// @access  Private
exports.getRoutes = async (req, res) => {
  try {
    const { 
      origin, 
      destination, 
      near, 
      sacco, 
      page = 1, 
      limit = 20 
    } = req.query;

    let query = { status: 'active' };

    // Search by origin/destination name
    if (origin) {
      query['origin.name'] = { $regex: origin, $options: 'i' };
    }
    if (destination) {
      query['destination.name'] = { $regex: destination, $options: 'i' };
    }

    // Filter by sacco
    if (sacco) {
      query.saccoIds = mongoose.Types.ObjectId(sacco);
    }

    // Geo-near query for nearby routes
    if (near) {
      const [lng, lat] = near.split(',').map(Number);
      if (!isNaN(lng) && !isNaN(lat)) {
        query['path'] = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat]
            },
            $maxDistance: 5000 // 5km radius
          }
        };
      }
    }

    const skip = (page - 1) * limit;

    const routes = await Route.find(query)
      .populate('saccoIds', 'name logo')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ popularity: -1, name: 1 });

    const total = await Route.countDocuments(query);

    res.status(200).json({
      success: true,
      count: routes.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: routes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch routes'
    });
  }
};

// @desc    Get route details
// @route   GET /api/passenger/routes/:id
// @access  Private
exports.getRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id)
      .populate('saccoIds', 'name logo contactPhone');

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    res.status(200).json({
      success: true,
      data: route
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch route details'
    });
  }
};

// @desc    Get active trips for a route
// @route   GET /api/passenger/routes/:id/trips
// @access  Private
exports.getRouteTrips = async (req, res) => {
  try {
    const { status = 'active' } = req.query;
    const routeId = req.params.id;

    const trips = await Trip.find({
      routeId,
      status: { $in: ['boarding', 'active'] }
    })
      .populate('vehicleId', 'plateNumber capacity features')
      .populate('driverId', 'name')
      .populate('saccoId', 'name logo')
      .sort({ currentStageIndex: 1 });

    // Calculate ETAs for each trip
    const tripsWithETAs = await Promise.all(
      trips.map(async (trip) => {
        const tripObj = trip.toObject();
        
        // Find current stage
        const route = await Route.findById(routeId);
        if (route && route.stages.length > 0) {
          const currentStage = route.stages[trip.currentStageIndex];
          if (currentStage) {
            tripObj.currentStage = currentStage;
          }
        }

        // Simple ETA calculation (in production, use more complex algorithm)
        tripObj.etaToNextStage = '5-10 mins'; // Placeholder

        return tripObj;
      })
    );

    res.status(200).json({
      success: true,
      count: trips.length,
      data: tripsWithETAs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trips'
    });
  }
};

// @desc    Get trip details with ETA
// @route   GET /api/passenger/trips/:id/eta
// @access  Private
exports.getTripETA = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('vehicleId', 'plateNumber capacity')
      .populate('routeId', 'name stages')
      .populate('driverId', 'name');

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Get route for stage information
    const route = await Route.findById(trip.routeId);

    // Calculate ETA to each upcoming stage
    const upcomingStages = route.stages.slice(trip.currentStageIndex);
    const stageETAs = upcomingStages.map((stage, index) => {
      // Simple calculation: 3 minutes per stage + traffic factor
      const baseMinutes = (index + 1) * 3;
      const trafficFactor = trip.crowdLevel === 'high' || trip.crowdLevel === 'full' ? 1.5 : 1;
      const estimatedMinutes = Math.round(baseMinutes * trafficFactor);

      return {
        stage: stage,
        eta: new Date(Date.now() + estimatedMinutes * 60000),
        estimatedMinutes: estimatedMinutes,
        distance: null // Would be calculated with actual distance
      };
    });

    res.status(200).json({
      success: true,
      data: {
        trip,
        currentLocation: trip.currentLocation,
        nextStage: route.stages[trip.currentStageIndex],
        stageETAs,
        crowdLevel: trip.crowdLevel,
        passengerCount: trip.passengerCount,
        updatedAt: trip.updatedAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate ETA'
    });
  }
};

// @desc    Reserve a seat
// @route   POST /api/passenger/reservations
// @access  Private
exports.reserveSeat = async (req, res) => {
  try {
    const { tripId, stageId, stageIndex, paymentMethod = 'mpesa' } = req.body;

    // Validate trip exists and is active
    const trip = await Trip.findById(tripId);
    if (!trip || !['boarding', 'active'].includes(trip.status)) {
      return res.status(400).json({
        success: false,
        message: 'Trip is not available for reservation'
      });
    }

    // Check capacity
    if (trip.passengerCount >= trip.vehicleId.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle is at full capacity'
      });
    }

    // Get route for fare calculation
    const route = await Route.findById(trip.routeId);
    const stage = route.stages[stageIndex];

    // Calculate fare (simplified - use actual fare structure)
    const baseFare = route.fareStructure.baseFare;
    const isPeak = this.isPeakHour();
    const fare = isPeak ? baseFare * route.fareStructure.peakMultiplier : baseFare;

    // Generate reservation code
    const code = `RES${Date.now()}${Math.floor(Math.random() * 1000)}`.substring(0, 10);

    // Create reservation
    const reservation = await Reservation.create({
      passengerId: req.user.id,
      tripId,
      stageId,
      stageIndex,
      pickupStage: {
        name: stage.name,
        location: stage.location
      },
      fare,
      code,
      status: 'pending',
      payment: {
        method: paymentMethod,
        amount: fare,
        status: 'pending'
      },
      expiresAt: new Date(Date.now() + 15 * 60000) // 15 minutes
    });

    // If payment method is mpesa, initiate payment
    if (paymentMethod === 'mpesa') {
      // TODO: Integrate with M-Pesa API
      // For now, simulate successful payment
      reservation.payment.status = 'completed';
      reservation.payment.mpesaCode = `MP${Date.now()}`;
      reservation.payment.completedAt = new Date();
      reservation.status = 'confirmed';
      await reservation.save();

      // Increment passenger count
      trip.passengerCount += 1;
      await trip.save();
    }

    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      data: reservation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to create reservation'
    });
  }
};

// @desc    Get user reservations
// @route   GET /api/passenger/reservations
// @access  Private
exports.getReservations = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = { passengerId: req.user.id };

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const reservations = await Reservation.find(query)
      .populate('tripId', 'status currentLocation')
      .populate({
        path: 'tripId',
        populate: {
          path: 'vehicleId',
          select: 'plateNumber'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Reservation.countDocuments(query);

    res.status(200).json({
      success: true,
      count: reservations.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
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

// @desc    Cancel reservation
// @route   PUT /api/passenger/reservations/:id/cancel
// @access  Private
exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      _id: req.params.id,
      passengerId: req.user.id
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    if (!['pending', 'confirmed'].includes(reservation.status)) {
      return res.status(400).json({
        success: false,
        message: 'Reservation cannot be cancelled'
      });
    }

    reservation.status = 'cancelled';
    reservation.cancellationReason = req.body.reason;
    await reservation.save();

    // Decrement passenger count if reservation was confirmed
    if (reservation.status === 'confirmed') {
      await Trip.findByIdAndUpdate(reservation.tripId, {
        $inc: { passengerCount: -1 }
      });
    }

    // TODO: Process refund if payment was made

    res.status(200).json({
      success: true,
      message: 'Reservation cancelled successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel reservation'
    });
  }
};

// @desc    Report an alert
// @route   POST /api/passenger/alerts
// @access  Private
exports.reportAlert = async (req, res) => {
  try {
    const { type, title, description, location, severity, routeIds } = req.body;

    const alert = await Alert.create({
      type,
      title,
      description,
      location: {
        type: 'Point',
        coordinates: [location.lng, location.lat],
        address: location.address,
        landmark: location.landmark
      },
      reportedBy: req.user.id,
      severity,
      routeIds,
      stats: {
        confirmations: 1
      }
    });

    // TODO: Send real-time notification to nearby users

    res.status(201).json({
      success: true,
      message: 'Alert reported successfully',
      data: alert
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to report alert'
    });
  }
};

// @desc    Get nearby alerts
// @route   GET /api/passenger/alerts/nearby
// @access  Private
exports.getNearbyAlerts = async (req, res) => {
  try {
    const { lng, lat, radius = 5000 } = req.query; // radius in meters

    if (!lng || !lat) {
      return res.status(400).json({
        success: false,
        message: 'Location coordinates required'
      });
    }

    const alerts = await Alert.find({
      status: 'active',
      expiresAt: { $gt: new Date() },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      }
    })
      .populate('reportedBy', 'name')
      .sort({ severity: -1, createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alerts'
    });
  }
};

// @desc    Confirm/verify an alert
// @route   POST /api/passenger/alerts/:id/confirm
// @access  Private
exports.confirmAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    // Check if user already confirmed
    const alreadyConfirmed = alert.verifiedBy.some(
      v => v.userId.toString() === req.user.id
    );

    if (!alreadyConfirmed) {
      alert.verifiedBy.push({
        userId: req.user.id,
        timestamp: new Date()
      });
      alert.stats.confirmations += 1;
      alert.verificationScore += 1;
      await alert.save();
    }

    res.status(200).json({
      success: true,
      message: 'Alert confirmed',
      data: {
        confirmations: alert.stats.confirmations,
        verificationScore: alert.verificationScore
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm alert'
    });
  }
};

// @desc    Add favorite route/stage
// @route   POST /api/passenger/favorites
// @access  Private
exports.addFavorite = async (req, res) => {
  try {
    const { routeId, stageId } = req.body;

    const user = await User.findById(req.user.id);

    // Check if already favorited
    const exists = user.favorites.some(
      fav => fav.routeId.toString() === routeId && fav.stageId.toString() === stageId
    );

    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Already in favorites'
      });
    }

    user.favorites.push({
      routeId,
      stageId,
      addedAt: new Date()
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Added to favorites',
      data: user.favorites
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to add favorite'
    });
  }
};

// @desc    Remove favorite
// @route   DELETE /api/passenger/favorites/:id
// @access  Private
exports.removeFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.favorites = user.favorites.filter(
      fav => fav._id.toString() !== req.params.id
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Removed from favorites',
      data: user.favorites
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove favorite'
    });
  }
};

// @desc    Get user favorites
// @route   GET /api/passenger/favorites
// @access  Private
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'favorites.routeId',
        select: 'name origin destination'
      })
      .populate({
        path: 'favorites.stageId',
        select: 'name'
      });

    res.status(200).json({
      success: true,
      data: user.favorites
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch favorites'
    });
  }
};

// Helper function to check if current time is peak hour
exports.isPeakHour = () => {
  const now = new Date();
  const hour = now.getHours();
  // Typical peak hours: 7-9 AM and 5-7 PM
  return (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
};