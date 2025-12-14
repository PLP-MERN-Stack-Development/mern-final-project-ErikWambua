const Sacco = require('../models/Sacco');
const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');
const User = require('../models/User');
const Route = require('../models/Route');
const mongoose = require('mongoose');

// @desc    Get Sacco dashboard
// @route   GET /api/sacco/dashboard
// @access  Private (Sacco Admin only)
exports.getDashboard = async (req, res) => {
  try {
    const saccoId = req.user.saccoId;

    if (!saccoId) {
      return res.status(403).json({
        success: false,
        message: 'You are not associated with any Sacco'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Sacco details
    const sacco = await Sacco.findById(saccoId);

    // Active vehicles
    const activeVehicles = await Vehicle.find({
      saccoId,
      status: 'active'
    }).populate('driverId', 'name phone');

    // Active trips
    const activeTrips = await Trip.find({
      saccoId,
      status: { $in: ['boarding', 'active'] }
    })
      .populate('vehicleId', 'plateNumber')
      .populate('driverId', 'name')
      .populate('routeId', 'name');

    // Today's completed trips
    const todaysTrips = await Trip.find({
      saccoId,
      status: 'completed',
      createdAt: { $gte: today }
    });

    // Yesterday's trips for comparison
    const yesterdaysTrips = await Trip.find({
      saccoId,
      status: 'completed',
      createdAt: { $gte: yesterday, $lt: today }
    });

    // Calculate statistics
    const todayStats = {
      trips: todaysTrips.length,
      revenue: todaysTrips.reduce((sum, trip) => sum + (trip.revenue || 0), 0),
      passengers: todaysTrips.reduce((sum, trip) => sum + (trip.passengerCount || 0), 0),
      distance: todaysTrips.reduce((sum, trip) => sum + (trip.statistics.totalDistance || 0), 0)
    };

    const yesterdayStats = {
      trips: yesterdaysTrips.length,
      revenue: yesterdaysTrips.reduce((sum, trip) => sum + (trip.revenue || 0), 0),
      passengers: yesterdaysTrips.reduce((sum, trip) => sum + (trip.passengerCount || 0), 0)
    };

    // Vehicle status breakdown
    const vehicleStatus = await Vehicle.aggregate([
      { $match: { saccoId: mongoose.Types.ObjectId(saccoId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Driver performance (top 5 by revenue)
    const topDrivers = await Trip.aggregate([
      {
        $match: {
          saccoId: mongoose.Types.ObjectId(saccoId),
          status: 'completed',
          createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
        }
      },
      {
        $group: {
          _id: '$driverId',
          totalRevenue: { $sum: '$revenue' },
          tripCount: { $sum: 1 },
          avgPassengers: { $avg: '$passengerCount' }
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
          avgPassengers: { $round: ['$avgPassengers', 1] }
        }
      }
    ]);

    // Route popularity
    const popularRoutes = await Trip.aggregate([
      {
        $match: {
          saccoId: mongoose.Types.ObjectId(saccoId),
          status: 'completed',
          createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
        }
      },
      {
        $group: {
          _id: '$routeId',
          tripCount: { $sum: 1 },
          totalPassengers: { $sum: '$passengerCount' },
          totalRevenue: { $sum: '$revenue' }
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
          origin: '$route.origin.name',
          destination: '$route.destination.name',
          tripCount: 1,
          totalPassengers: 1,
          totalRevenue: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        sacco,
        stats: {
          today: todayStats,
          yesterday: yesterdayStats,
          growth: {
            trips: todayStats.trips - yesterdayStats.trips,
            revenue: todayStats.revenue - yesterdayStats.revenue,
            percentage: yesterdayStats.trips > 0 ? 
              ((todayStats.trips - yesterdayStats.trips) / yesterdayStats.trips * 100).toFixed(1) : 0
          }
        },
        activeVehicles: {
          count: activeVehicles.length,
          vehicles: activeVehicles
        },
        activeTrips: {
          count: activeTrips.length,
          trips: activeTrips
        },
        vehicleStatus,
        topDrivers,
        popularRoutes
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

// @desc    Get Sacco vehicles
// @route   GET /api/sacco/vehicles
// @access  Private (Sacco Admin only)
exports.getVehicles = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const saccoId = req.user.saccoId;

    if (!saccoId) {
      return res.status(403).json({
        success: false,
        message: 'You are not associated with any Sacco'
      });
    }

    const query = { saccoId };
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const vehicles = await Vehicle.find(query)
      .populate('driverId', 'name phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Vehicle.countDocuments(query);

    // Get vehicle statistics
    const vehicleStats = await Vehicle.aggregate([
      { $match: { saccoId: mongoose.Types.ObjectId(saccoId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      count: vehicles.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      stats: vehicleStats,
      data: vehicles
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vehicles'
    });
  }
};

// @desc    Add new vehicle
// @route   POST /api/sacco/vehicles
// @access  Private (Sacco Admin only)
exports.addVehicle = async (req, res) => {
  try {
    const saccoId = req.user.saccoId;

    if (!saccoId) {
      return res.status(403).json({
        success: false,
        message: 'You are not associated with any Sacco'
      });
    }

    // Check if plate number already exists
    const existingVehicle = await Vehicle.findOne({
      plateNumber: req.body.plateNumber
    });

    if (existingVehicle) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle with this plate number already exists'
      });
    }

    const vehicle = await Vehicle.create({
      ...req.body,
      saccoId
    });

    // Update Sacco's vehicle list
    await Sacco.findByIdAndUpdate(saccoId, {
      $push: { vehicles: vehicle._id }
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle added successfully',
      data: vehicle
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to add vehicle'
    });
  }
};

// @desc    Update vehicle
// @route   PUT /api/sacco/vehicles/:id
// @access  Private (Sacco Admin only)
exports.updateVehicle = async (req, res) => {
  try {
    const saccoId = req.user.saccoId;

    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      saccoId
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found or not authorized'
      });
    }

    // Remove fields that shouldn't be updated
    const updateData = { ...req.body };
    delete updateData.saccoId;
    delete updateData.plateNumber; // Plate number shouldn't be changed

    Object.assign(vehicle, updateData);
    await vehicle.save();

    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      data: vehicle
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to update vehicle'
    });
  }
};

// @desc    Assign driver to vehicle
// @route   PUT /api/sacco/vehicles/:id/assign-driver
// @access  Private (Sacco Admin only)
exports.assignDriver = async (req, res) => {
  try {
    const { driverId } = req.body;
    const saccoId = req.user.saccoId;

    // Verify driver exists and belongs to same sacco
    const driver = await User.findOne({
      _id: driverId,
      saccoId,
      role: 'driver'
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found or not authorized'
      });
    }

    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      saccoId
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found or not authorized'
      });
    }

    // Remove driver from previous vehicle if any
    await Vehicle.updateOne(
      { driverId, saccoId },
      { driverId: null }
    );

    // Assign to new vehicle
    vehicle.driverId = driverId;
    await vehicle.save();

    // Update driver's vehicle reference
    driver.vehicleId = vehicle._id;
    await driver.save();

    res.status(200).json({
      success: true,
      message: 'Driver assigned successfully',
      data: {
        vehicle,
        driver: {
          id: driver._id,
          name: driver.name,
          phone: driver.phone
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign driver'
    });
  }
};

// @desc    Get Sacco drivers
// @route   GET /api/sacco/drivers
// @access  Private (Sacco Admin only)
exports.getDrivers = async (req, res) => {
  try {
    const saccoId = req.user.saccoId;
    const { status, page = 1, limit = 20 } = req.query;

    const query = {
      saccoId,
      role: 'driver'
    };

    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const drivers = await User.find(query)
      .select('-password')
      .populate('vehicleId', 'plateNumber')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    // Get driver performance stats
    const driverStats = await Promise.all(
      drivers.map(async (driver) => {
        const trips = await Trip.find({
          driverId: driver._id,
          status: 'completed',
          createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
        });

        return {
          driverId: driver._id,
          name: driver.name,
          phone: driver.phone,
          status: driver.status,
          vehicle: driver.vehicleId,
          stats: {
            totalTrips: trips.length,
            totalRevenue: trips.reduce((sum, trip) => sum + (trip.revenue || 0), 0),
            avgPassengers: trips.length > 0 ? 
              (trips.reduce((sum, trip) => sum + (trip.passengerCount || 0), 0) / trips.length).toFixed(1) : 0
          }
        };
      })
    );

    res.status(200).json({
      success: true,
      count: drivers.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: driverStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch drivers'
    });
  }
};

// @desc    Get Sacco trips
// @route   GET /api/sacco/trips
// @access  Private (Sacco Admin only)
exports.getTrips = async (req, res) => {
  try {
    const saccoId = req.user.saccoId;
    const { 
      status, 
      driverId, 
      vehicleId, 
      routeId,
      startDate, 
      endDate,
      page = 1, 
      limit = 20 
    } = req.query;

    const query = { saccoId };

    if (status) query.status = status;
    if (driverId) query.driverId = driverId;
    if (vehicleId) query.vehicleId = vehicleId;
    if (routeId) query.routeId = routeId;

    // Date filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const trips = await Trip.find(query)
      .populate('vehicleId', 'plateNumber')
      .populate('driverId', 'name phone')
      .populate('routeId', 'name origin destination')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Trip.countDocuments(query);

    // Calculate summary statistics
    const totalRevenue = trips.reduce((sum, trip) => sum + (trip.revenue || 0), 0);
    const totalPassengers = trips.reduce((sum, trip) => sum + (trip.passengerCount || 0), 0);
    const totalDistance = trips.reduce((sum, trip) => sum + (trip.statistics.totalDistance || 0), 0);

    res.status(200).json({
      success: true,
      count: trips.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      summary: {
        totalRevenue,
        totalPassengers,
        totalDistance,
        avgPassengersPerTrip: trips.length > 0 ? (totalPassengers / trips.length).toFixed(1) : 0
      },
      data: trips
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trips'
    });
  }
};

// @desc    Get Sacco routes
// @route   GET /api/sacco/routes
// @access  Private (Sacco Admin only)
exports.getRoutes = async (req, res) => {
  try {
    const saccoId = req.user.saccoId;
    const sacco = await Sacco.findById(saccoId);

    if (!sacco) {
      return res.status(404).json({
        success: false,
        message: 'Sacco not found'
      });
    }

    const routes = await Route.find({ saccoIds: saccoId })
      .populate('saccoIds', 'name')
      .sort({ name: 1 });

    // Get route performance statistics
    const routesWithStats = await Promise.all(
      routes.map(async (route) => {
        const trips = await Trip.find({
          routeId: route._id,
          saccoId,
          status: 'completed',
          createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
        });

        return {
          ...route.toObject(),
          stats: {
            totalTrips: trips.length,
            totalPassengers: trips.reduce((sum, trip) => sum + (trip.passengerCount || 0), 0),
            totalRevenue: trips.reduce((sum, trip) => sum + (trip.revenue || 0), 0),
            avgPassengers: trips.length > 0 ? 
              (trips.reduce((sum, trip) => sum + (trip.passengerCount || 0), 0) / trips.length).toFixed(1) : 0
          }
        };
      })
    );

    res.status(200).json({
      success: true,
      count: routes.length,
      data: routesWithStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch routes'
    });
  }
};

// @desc    Add route to Sacco
// @route   POST /api/sacco/routes
// @access  Private (Sacco Admin only)
exports.addRoute = async (req, res) => {
  try {
    const saccoId = req.user.saccoId;

    // Check if route already exists
    let route = await Route.findOne({ name: req.body.name });

    if (route) {
      // Add sacco to existing route if not already added
      if (!route.saccoIds.includes(saccoId)) {
        route.saccoIds.push(saccoId);
        await route.save();
      }
    } else {
      // Create new route
      route = await Route.create({
        ...req.body,
        saccoIds: [saccoId]
      });
    }

    // Add route to Sacco
    await Sacco.findByIdAndUpdate(saccoId, {
      $addToSet: { routes: route._id }
    });

    res.status(201).json({
      success: true,
      message: 'Route added successfully',
      data: route
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to add route'
    });
  }
};

// @desc    Remove route from Sacco
// @route   DELETE /api/sacco/routes/:id
// @access  Private (Sacco Admin only)
exports.removeRoute = async (req, res) => {
  try {
    const saccoId = req.user.saccoId;

    // Remove sacco from route
    await Route.findByIdAndUpdate(req.params.id, {
      $pull: { saccoIds: saccoId }
    });

    // Remove route from Sacco
    await Sacco.findByIdAndUpdate(saccoId, {
      $pull: { routes: req.params.id }
    });

    res.status(200).json({
      success: true,
      message: 'Route removed successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove route'
    });
  }
};

// @desc    Send announcement to passengers
// @route   POST /api/sacco/announcements
// @access  Private (Sacco Admin only)
exports.sendAnnouncement = async (req, res) => {
  try {
    const saccoId = req.user.saccoId;
    const { title, message, type, target } = req.body;

    // TODO: Implement announcement system
    // This could be:
    // 1. Push notifications to all users following Sacco's routes
    // 2. In-app notifications
    // 3. SMS to registered users

    // For now, just log the announcement
    console.log(`Sacco ${saccoId} announcement:`, {
      title,
      message,
      type,
      target,
      timestamp: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Announcement sent successfully',
      data: {
        title,
        message,
        sentAt: new Date()
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to send announcement'
    });
  }
};

// @desc    Get Sacco revenue analytics
// @route   GET /api/sacco/analytics/revenue
// @access  Private (Sacco Admin only)
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const saccoId = req.user.saccoId;
    const { period = '30d' } = req.query;

    let days;
    switch (period) {
      case '7d': days = 7; break;
      case '30d': days = 30; break;
      case '90d': days = 90; break;
      default: days = 30;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Daily revenue data
    const dailyRevenue = await Trip.aggregate([
      {
        $match: {
          saccoId: mongoose.Types.ObjectId(saccoId),
          status: 'completed',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          totalRevenue: { $sum: '$revenue' },
          tripCount: { $sum: 1 },
          passengerCount: { $sum: '$passengerCount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Format daily data
    const formattedData = dailyRevenue.map(item => ({
      date: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}-${item._id.day.toString().padStart(2, '0')}`,
      revenue: item.totalRevenue,
      trips: item.tripCount,
      passengers: item.passengerCount
    }));

    // Summary statistics
    const summary = await Trip.aggregate([
      {
        $match: {
          saccoId: mongoose.Types.ObjectId(saccoId),
          status: 'completed',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$revenue' },
          totalTrips: { $sum: 1 },
          totalPassengers: { $sum: '$passengerCount' },
          avgRevenuePerTrip: { $avg: '$revenue' },
          avgPassengersPerTrip: { $avg: '$passengerCount' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        period,
        startDate,
        endDate: new Date(),
        summary: summary[0] || {
          totalRevenue: 0,
          totalTrips: 0,
          totalPassengers: 0,
          avgRevenuePerTrip: 0,
          avgPassengersPerTrip: 0
        },
        dailyData: formattedData
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch revenue analytics'
    });
  }
};