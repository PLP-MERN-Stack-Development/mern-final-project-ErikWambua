const Trip = require('../models/Trip');
const Route = require('../models/Route');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const Sacco = require('../models/Sacco');
const Reservation = require('../models/Reservation');
const mongoose = require('mongoose');
const { calculateDistance } = require('../utils/calculations');
const etaService = require('../services/etaService');
const socketService = require('../services/socketService');

// @desc    Get all active trips
// @route   GET /api/trips/active
// @access  Private (All authenticated users)
exports.getActiveTrips = async (req, res) => {
  try {
    const { 
      routeId, 
      saccoId, 
      vehicleId, 
      driverId,
      status = 'active',
      page = 1, 
      limit = 50 
    } = req.query;

    const query = {};

    // Filter by status
    if (status === 'active') {
      query.status = { $in: ['boarding', 'active'] };
    } else if (status) {
      query.status = status;
    }

    // Add filters
    if (routeId) query.routeId = routeId;
    if (saccoId) query.saccoId = saccoId;
    if (vehicleId) query.vehicleId = vehicleId;
    if (driverId) query.driverId = driverId;

    const skip = (page - 1) * limit;

    const trips = await Trip.find(query)
      .populate('vehicleId', 'plateNumber capacity features')
      .populate('driverId', 'name phone avatar')
      .populate('saccoId', 'name logo')
      .populate('routeId', 'name origin destination stages')
      .select('-__v')
      .sort({ currentStageIndex: 1, updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Add distance to passenger for each trip
    const tripsWithDistance = await Promise.all(
      trips.map(async (trip) => {
        const tripObj = trip.toObject();
        
        // Calculate distance from trip to user if coordinates provided
        if (req.query.lat && req.query.lng) {
          const userLat = parseFloat(req.query.lat);
          const userLng = parseFloat(req.query.lng);
          
          if (!isNaN(userLat) && !isNaN(userLng)) {
            const tripLat = trip.currentLocation.coordinates[1];
            const tripLng = trip.currentLocation.coordinates[0];
            
            tripObj.distanceToUser = calculateDistance(
              [userLng, userLat],
              [tripLng, tripLat]
            );
          }
        }

        // Get current stage name
        if (trip.routeId && trip.routeId.stages && trip.currentStageIndex !== undefined) {
          const currentStage = trip.routeId.stages[trip.currentStageIndex];
          if (currentStage) {
            tripObj.currentStage = {
              name: currentStage.name,
              location: currentStage.location
            };
          }
        }

        // Add ETA to next stage
        if (trip.stageETAs && trip.stageETAs.length > 0) {
          const nextStageETA = trip.stageETAs[0];
          tripObj.nextStageETA = nextStageETA;
        }

        return tripObj;
      })
    );

    // Sort by distance if user location provided
    if (req.query.lat && req.query.lng) {
      tripsWithDistance.sort((a, b) => {
        return (a.distanceToUser || Infinity) - (b.distanceToUser || Infinity);
      });
    }

    const total = await Trip.countDocuments(query);

    res.status(200).json({
      success: true,
      count: trips.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: tripsWithDistance
    });
  } catch (error) {
    console.error('Get active trips error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active trips',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get trip details
// @route   GET /api/trips/:id
// @access  Private (All authenticated users)
exports.getTripDetails = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('vehicleId', 'plateNumber capacity features make model color')
      .populate('driverId', 'name phone avatar rating totalTrips')
      .populate('saccoId', 'name logo contactPhone rating')
      .populate('routeId', 'name origin destination stages fareStructure')
      .populate({
        path: 'incidents.reportedBy',
        select: 'name phone'
      });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Get reservations for this trip
    const reservations = await Reservation.find({
      tripId: trip._id,
      status: { $in: ['confirmed', 'boarded'] }
    })
      .populate('passengerId', 'name phone')
      .select('stageId stageIndex boardedAt')
      .sort('stageIndex');

    // Calculate detailed ETAs
    const stageETAs = await etaService.calculateTripETAs(trip._id);

    // Get current stage
    const currentStage = trip.routeId?.stages?.[trip.currentStageIndex];

    // Prepare response
    const tripDetails = {
      ...trip.toObject(),
      reservations: reservations,
      detailedETAs: stageETAs,
      currentStage: currentStage,
      statistics: {
        ...trip.statistics,
        reservationsCount: reservations.length,
        availableSeats: trip.vehicleId.capacity - trip.passengerCount
      }
    };

    res.status(200).json({
      success: true,
      data: tripDetails
    });
  } catch (error) {
    console.error('Get trip details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trip details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Search trips by location
// @route   GET /api/trips/search
// @access  Private
exports.searchTrips = async (req, res) => {
  try {
    const { lat, lng, radius = 2000, routeId, saccoId } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const searchRadius = parseInt(radius);

    if (isNaN(userLat) || isNaN(userLng) || isNaN(searchRadius)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates or radius'
      });
    }

    // Build query for active trips near location
    const query = {
      status: { $in: ['boarding', 'active'] },
      'currentLocation.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [userLng, userLat]
          },
          $maxDistance: searchRadius
        }
      }
    };

    if (routeId) query.routeId = routeId;
    if (saccoId) query.saccoId = saccoId;

    const trips = await Trip.find(query)
      .populate('vehicleId', 'plateNumber capacity features')
      .populate('driverId', 'name')
      .populate('saccoId', 'name logo')
      .populate('routeId', 'name origin destination')
      .limit(20);

    // Calculate distance for each trip
    const tripsWithDistance = trips.map(trip => {
      const tripObj = trip.toObject();
      const tripLat = trip.currentLocation.coordinates[1];
      const tripLng = trip.currentLocation.coordinates[0];
      
      tripObj.distance = calculateDistance(
        [userLng, userLat],
        [tripLng, tripLat]
      );
      
      // Calculate ETA in minutes (rough estimate)
      const distanceKm = tripObj.distance / 1000;
      const averageSpeed = trip.currentLocation.speed || 30; // km/h
      const etaMinutes = Math.round((distanceKm / averageSpeed) * 60);
      
      tripObj.etaMinutes = Math.max(etaMinutes, 1);
      
      return tripObj;
    });

    // Sort by distance
    tripsWithDistance.sort((a, b) => a.distance - b.distance);

    res.status(200).json({
      success: true,
      count: trips.length,
      data: tripsWithDistance
    });
  } catch (error) {
    console.error('Search trips error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search trips'
    });
  }
};

// @desc    Get trips by route
// @route   GET /api/trips/route/:routeId
// @access  Private
exports.getTripsByRoute = async (req, res) => {
  try {
    const { status, timeRange = 'today' } = req.query;
    const routeId = req.params.routeId;

    const query = { routeId };

    // Status filter
    if (status) {
      query.status = status;
    } else {
      query.status = { $in: ['boarding', 'active'] };
    }

    // Time range filter
    if (timeRange === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query.createdAt = { $gte: today };
    } else if (timeRange === 'this_week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      query.createdAt = { $gte: weekAgo };
    }

    const trips = await Trip.find(query)
      .populate('vehicleId', 'plateNumber capacity')
      .populate('driverId', 'name')
      .populate('saccoId', 'name logo')
      .sort({ status: 1, currentStageIndex: 1 });

    // Group by status
    const groupedTrips = {
      boarding: trips.filter(t => t.status === 'boarding'),
      active: trips.filter(t => t.status === 'active'),
      completed: trips.filter(t => t.status === 'completed'),
      scheduled: trips.filter(t => t.status === 'scheduled')
    };

    // Calculate statistics
    const stats = {
      total: trips.length,
      boarding: groupedTrips.boarding.length,
      active: groupedTrips.active.length,
      completed: groupedTrips.completed.length,
      scheduled: groupedTrips.scheduled.length,
      averagePassengers: trips.length > 0 ? 
        (trips.reduce((sum, t) => sum + (t.passengerCount || 0), 0) / trips.length).toFixed(1) : 0,
      averageRevenue: trips.length > 0 ? 
        (trips.reduce((sum, t) => sum + (t.revenue || 0), 0) / trips.length).toFixed(0) : 0
    };

    res.status(200).json({
      success: true,
      count: trips.length,
      stats,
      data: {
        boarding: groupedTrips.boarding,
        active: groupedTrips.active,
        completed: groupedTrips.completed,
        scheduled: groupedTrips.scheduled
      }
    });
  } catch (error) {
    console.error('Get trips by route error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trips by route'
    });
  }
};

// @desc    Get trips by vehicle
// @route   GET /api/trips/vehicle/:vehicleId
// @access  Private
exports.getTripsByVehicle = async (req, res) => {
  try {
    const { startDate, endDate, page = 1, limit = 20 } = req.query;
    const vehicleId = req.params.vehicleId;

    const query = { vehicleId };

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const trips = await Trip.find(query)
      .populate('routeId', 'name origin destination')
      .populate('driverId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Trip.countDocuments(query);

    // Calculate vehicle statistics
    const completedTrips = trips.filter(t => t.status === 'completed');
    const vehicleStats = {
      totalTrips: total,
      completedTrips: completedTrips.length,
      totalRevenue: completedTrips.reduce((sum, t) => sum + (t.revenue || 0), 0),
      totalDistance: completedTrips.reduce((sum, t) => sum + (t.statistics.totalDistance || 0), 0),
      totalPassengers: completedTrips.reduce((sum, t) => sum + (t.passengerCount || 0), 0),
      averagePassengers: completedTrips.length > 0 ? 
        (completedTrips.reduce((sum, t) => sum + (t.passengerCount || 0), 0) / completedTrips.length).toFixed(1) : 0
    };

    res.status(200).json({
      success: true,
      count: trips.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      stats: vehicleStats,
      data: trips
    });
  } catch (error) {
    console.error('Get trips by vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trips by vehicle'
    });
  }
};

// @desc    Get trips by driver
// @route   GET /api/trips/driver/:driverId
// @access  Private
exports.getTripsByDriver = async (req, res) => {
  try {
    const { status, date, page = 1, limit = 20 } = req.query;
    const driverId = req.params.driverId;

    const query = { driverId };

    if (status) {
      query.status = status;
    }

    // Date filter
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      query.createdAt = {
        $gte: startDate,
        $lte: endDate
      };
    }

    const skip = (page - 1) * limit;

    const trips = await Trip.find(query)
      .populate('vehicleId', 'plateNumber')
      .populate('routeId', 'name')
      .populate('saccoId', 'name logo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Trip.countDocuments(query);

    // Calculate driver statistics
    const completedTrips = trips.filter(t => t.status === 'completed');
    const driverStats = {
      totalTrips: total,
      completedTrips: completedTrips.length,
      activeTrips: trips.filter(t => t.status === 'active').length,
      totalRevenue: completedTrips.reduce((sum, t) => sum + (t.revenue || 0), 0),
      totalDistance: completedTrips.reduce((sum, t) => sum + (t.statistics.totalDistance || 0), 0),
      totalPassengers: completedTrips.reduce((sum, t) => sum + (t.passengerCount || 0), 0),
      averageRating: 0 // Would come from driver reviews
    };

    res.status(200).json({
      success: true,
      count: trips.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      stats: driverStats,
      data: trips
    });
  } catch (error) {
    console.error('Get trips by driver error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trips by driver'
    });
  }
};

// @desc    Create a scheduled trip
// @route   POST /api/trips/schedule
// @access  Private (Driver/Sacco Admin)
exports.createScheduledTrip = async (req, res) => {
  try {
    const { 
      routeId, 
      vehicleId, 
      scheduledStartTime,
      driverId,
      notes 
    } = req.body;

    // Check if user has permission
    const user = await User.findById(req.user.id);
    
    if (user.role === 'driver') {
      // Driver can only schedule for themselves
      if (driverId && driverId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Drivers can only schedule trips for themselves'
        });
      }
    }

    // Verify vehicle exists and is available
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Check for overlapping trips
    const overlappingTrip = await Trip.findOne({
      vehicleId,
      scheduledStartTime: {
        $lte: new Date(scheduledStartTime),
        $gte: new Date(new Date(scheduledStartTime).setHours(-2, 0, 0, 0))
      },
      status: { $in: ['scheduled', 'boarding'] }
    });

    if (overlappingTrip) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle already has a scheduled trip around this time'
      });
    }

    // Create scheduled trip
    const trip = await Trip.create({
      routeId,
      vehicleId,
      driverId: driverId || req.user.id,
      saccoId: vehicle.saccoId,
      status: 'scheduled',
      scheduledStartTime: new Date(scheduledStartTime),
      notes,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Trip scheduled successfully',
      data: trip
    });
  } catch (error) {
    console.error('Schedule trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to schedule trip',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update trip status
// @route   PUT /api/trips/:id/status
// @access  Private (Driver/Sacco Admin)
exports.updateTripStatus = async (req, res) => {
  try {
    const { status, reason } = req.body;
    const tripId = req.params.id;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Check permissions
    const user = await User.findById(req.user.id);
    if (user.role === 'driver' && trip.driverId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this trip'
      });
    }

    // Validate status transition
    const validTransitions = {
      scheduled: ['boarding', 'cancelled'],
      boarding: ['active', 'cancelled'],
      active: ['completed'],
      completed: [],
      cancelled: []
    };

    if (!validTransitions[trip.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${trip.status} to ${status}`
      });
    }

    // Update trip status
    trip.status = status;

    // Add timestamps based on status
    if (status === 'boarding' && !trip.startTime) {
      trip.startTime = new Date();
    } else if (status === 'active') {
      trip.startTime = trip.startTime || new Date();
    } else if (status === 'completed') {
      trip.endTime = new Date();
      
      // Calculate duration
      const duration = Math.round((trip.endTime - trip.startTime) / 60000);
      trip.statistics.duration = duration;
      
      // Update vehicle status
      await Vehicle.findByIdAndUpdate(trip.vehicleId, {
        status: 'offline'
      });
    } else if (status === 'cancelled') {
      trip.endTime = new Date();
      if (reason) {
        trip.incidents.push({
          type: 'cancellation',
          description: reason,
          timestamp: new Date(),
          reportedBy: req.user.id
        });
      }
    }

    await trip.save();

    // Emit real-time update
    socketService.emitToRoom(`trip:${tripId}`, 'trip:status:change', {
      tripId,
      status: trip.status,
      updatedAt: trip.updatedAt
    });

    res.status(200).json({
      success: true,
      message: `Trip status updated to ${status}`,
      data: trip
    });
  } catch (error) {
    console.error('Update trip status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update trip status'
    });
  }
};

// @desc    Add incident to trip
// @route   POST /api/trips/:id/incidents
// @access  Private (Driver)
exports.addIncident = async (req, res) => {
  try {
    const { type, description, location } = req.body;
    const tripId = req.params.id;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Check if driver owns the trip
    if (trip.driverId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add incident to this trip'
      });
    }

    // Add incident
    trip.incidents.push({
      type,
      description,
      location: location || trip.currentLocation,
      timestamp: new Date(),
      reportedBy: req.user.id,
      resolved: false
    });

    await trip.save();

    // Emit alert to passengers
    socketService.emitToRoom(`trip:${tripId}`, 'trip:incident', {
      tripId,
      incident: {
        type,
        description,
        timestamp: new Date()
      }
    });

    res.status(201).json({
      success: true,
      message: 'Incident reported successfully',
      data: trip.incidents[trip.incidents.length - 1]
    });
  } catch (error) {
    console.error('Add incident error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to report incident'
    });
  }
};

// @desc    Get trip analytics
// @route   GET /api/trips/analytics
// @access  Private (Sacco Admin/Super Admin)
exports.getTripAnalytics = async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      saccoId,
      routeId,
      groupBy = 'day'
    } = req.query;

    const query = { status: 'completed' };

    // Date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Sacco filter
    if (saccoId) {
      query.saccoId = saccoId;
    }

    // Route filter
    if (routeId) {
      query.routeId = routeId;
    }

    // Group by time period
    let groupFormat;
    switch (groupBy) {
      case 'hour':
        groupFormat = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
          hour: { $hour: '$createdAt' }
        };
        break;
      case 'day':
        groupFormat = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
        break;
      case 'week':
        groupFormat = {
          year: { $year: '$createdAt' },
          week: { $week: '$createdAt' }
        };
        break;
      case 'month':
        groupFormat = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
        break;
      default:
        groupFormat = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
    }

    // Aggregate analytics
    const analytics = await Trip.aggregate([
      { $match: query },
      {
        $group: {
          _id: groupFormat,
          totalTrips: { $sum: 1 },
          totalRevenue: { $sum: '$revenue' },
          totalPassengers: { $sum: '$passengerCount' },
          totalDistance: { $sum: '$statistics.totalDistance' },
          averageDuration: { $avg: '$statistics.duration' },
          averagePassengers: { $avg: '$passengerCount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.hour': 1 } }
    ]);

    // Format response
    const formattedAnalytics = analytics.map(item => {
      let period;
      if (groupBy === 'hour') {
        period = `${item._id.year}-${item._id.month.toString().padStart(2, '0')}-${item._id.day.toString().padStart(2, '0')} ${item._id.hour}:00`;
      } else if (groupBy === 'day') {
        period = `${item._id.year}-${item._id.month.toString().padStart(2, '0')}-${item._id.day.toString().padStart(2, '0')}`;
      } else if (groupBy === 'week') {
        period = `Week ${item._id.week}, ${item._id.year}`;
      } else if (groupBy === 'month') {
        period = `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`;
      }

      return {
        period,
        totalTrips: item.totalTrips,
        totalRevenue: item.totalRevenue,
        totalPassengers: item.totalPassengers,
        totalDistance: item.totalDistance,
        averageDuration: Math.round(item.averageDuration || 0),
        averagePassengers: Math.round(item.averagePassengers || 0),
        revenuePerTrip: item.totalTrips > 0 ? item.totalRevenue / item.totalTrips : 0
      };
    });

    // Calculate summary statistics
    const summary = formattedAnalytics.reduce((acc, curr) => ({
      totalTrips: acc.totalTrips + curr.totalTrips,
      totalRevenue: acc.totalRevenue + curr.totalRevenue,
      totalPassengers: acc.totalPassengers + curr.totalPassengers,
      totalDistance: acc.totalDistance + curr.totalDistance
    }), { totalTrips: 0, totalRevenue: 0, totalPassengers: 0, totalDistance: 0 });

    summary.averageRevenuePerTrip = summary.totalTrips > 0 ? summary.totalRevenue / summary.totalTrips : 0;
    summary.averagePassengersPerTrip = summary.totalTrips > 0 ? summary.totalPassengers / summary.totalTrips : 0;

    res.status(200).json({
      success: true,
      data: {
        summary,
        analytics: formattedAnalytics,
        groupBy,
        period: {
          startDate: startDate || 'All time',
          endDate: endDate || 'Now'
        }
      }
    });
  } catch (error) {
    console.error('Get trip analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trip analytics'
    });
  }
};

// @desc    Update trip location (admin override)
// @route   PUT /api/trips/:id/location
// @access  Private (Admin)
exports.updateTripLocation = async (req, res) => {
  try {
    const { coordinates, speed, heading, accuracy } = req.body;
    const tripId = req.params.id;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (!['sacco_admin', 'super_admin'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update trip location'
      });
    }

    // Update location
    trip.currentLocation = {
      type: 'Point',
      coordinates: [coordinates[0], coordinates[1]],
      timestamp: new Date(),
      speed: speed || trip.currentLocation.speed,
      heading: heading || trip.currentLocation.heading,
      accuracy: accuracy || trip.currentLocation.accuracy
    };

    // Update vehicle location
    await Vehicle.findByIdAndUpdate(trip.vehicleId, {
      currentLocation: trip.currentLocation,
      lastActive: new Date()
    });

    // Recalculate ETAs
    await etaService.calculateTripETAs(tripId);

    await trip.save();

    // Emit real-time update
    socketService.emitToRoom(`trip:${tripId}`, 'trip:location:update', {
      tripId,
      location: trip.currentLocation,
      updatedAt: trip.updatedAt
    });

    res.status(200).json({
      success: true,
      message: 'Trip location updated',
      data: {
        location: trip.currentLocation,
        updatedAt: trip.updatedAt
      }
    });
  } catch (error) {
    console.error('Update trip location error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update trip location'
    });
  }
};

// @desc    Get trip statistics
// @route   GET /api/trips/stats
// @access  Private (Admin)
exports.getTripStatistics = async (req, res) => {
  try {
    const { saccoId, startDate, endDate } = req.query;

    const query = { status: 'completed' };

    if (saccoId) query.saccoId = saccoId;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Get overall statistics
    const stats = await Trip.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalTrips: { $sum: 1 },
          totalRevenue: { $sum: '$revenue' },
          totalPassengers: { $sum: '$passengerCount' },
          totalDistance: { $sum: '$statistics.totalDistance' },
          avgDuration: { $avg: '$statistics.duration' },
          avgPassengers: { $avg: '$passengerCount' },
          avgRevenue: { $avg: '$revenue' }
        }
      }
    ]);

    // Get status distribution
    const statusStats = await Trip.aggregate([
      { $match: saccoId ? { saccoId: mongoose.Types.ObjectId(saccoId) } : {} },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get top routes by trips
    const topRoutes = await Trip.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$routeId',
          tripCount: { $sum: 1 },
          totalRevenue: { $sum: '$revenue' },
          totalPassengers: { $sum: '$passengerCount' }
        }
      },
      { $sort: { tripCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'routes',
          localField: '_id',
          foreignField: '_id',
          as: 'route'
        }
      },
      { $unwind: '$route' },
      {
        $project: {
          routeName: '$route.name',
          tripCount: 1,
          totalRevenue: 1,
          totalPassengers: 1
        }
      }
    ]);

    // Get top drivers by revenue
    const topDrivers = await Trip.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$driverId',
          totalRevenue: { $sum: '$revenue' },
          tripCount: { $sum: 1 },
          totalPassengers: { $sum: '$passengerCount' }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'driver'
        }
      },
      { $unwind: '$driver' },
      {
        $project: {
          driverName: '$driver.name',
          driverPhone: '$driver.phone',
          totalRevenue: 1,
          tripCount: 1,
          totalPassengers: 1
        }
      }
    ]);

    // Get peak hours
    const peakHours = await Trip.aggregate([
      { $match: query },
      {
        $group: {
          _id: { $hour: '$createdAt' },
          tripCount: { $sum: 1 },
          avgPassengers: { $avg: '$passengerCount' }
        }
      },
      { $sort: { tripCount: -1 } },
      { $limit: 5 }
    ]);

    const formattedStats = {
      overall: stats[0] || {
        totalTrips: 0,
        totalRevenue: 0,
        totalPassengers: 0,
        totalDistance: 0,
        avgDuration: 0,
        avgPassengers: 0,
        avgRevenue: 0
      },
      statusDistribution: statusStats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      topRoutes,
      topDrivers,
      peakHours: peakHours.map(hour => ({
        hour: hour._id,
        tripCount: hour.tripCount,
        avgPassengers: Math.round(hour.avgPassengers || 0)
      })),
      period: {
        startDate: startDate || 'Beginning',
        endDate: endDate || 'Now'
      }
    };

    res.status(200).json({
      success: true,
      data: formattedStats
    });
  } catch (error) {
    console.error('Get trip statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trip statistics'
    });
  }
};