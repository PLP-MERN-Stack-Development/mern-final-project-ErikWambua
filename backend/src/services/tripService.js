const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const Route = require('../models/Route');
const { calculateDistance } = require('../utils/calculations');
const etaService = require('./etaService');
const notificationService = require('./notificationService');

class TripService {
  // Create a new trip
  async createTrip(tripData) {
    try {
      // Validate vehicle is available
      const vehicle = await Vehicle.findById(tripData.vehicleId);
      if (!vehicle || vehicle.status !== 'active') {
        throw new Error('Vehicle is not available');
      }

      // Validate driver is available
      const driver = await User.findById(tripData.driverId);
      if (!driver || driver.status !== 'active') {
        throw new Error('Driver is not available');
      }

      // Check for existing active trip for this vehicle
      const existingTrip = await Trip.findOne({
        vehicleId: tripData.vehicleId,
        status: { $in: ['scheduled', 'boarding', 'active'] }
      });

      if (existingTrip) {
        throw new Error('Vehicle already has an active trip');
      }

      // Create trip
      const trip = await Trip.create(tripData);

      // Update vehicle status
      await Vehicle.findByIdAndUpdate(tripData.vehicleId, {
        status: 'active',
        lastActive: new Date()
      });

      // Update driver status
      await User.findByIdAndUpdate(tripData.driverId, {
        lastActive: new Date(),
        status: 'active'
      });

      return {
        success: true,
        data: trip
      };
    } catch (error) {
      console.error('Create trip error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update trip location
  async updateTripLocation(tripId, locationData) {
    try {
      const trip = await Trip.findById(tripId);
      if (!trip) {
        throw new Error('Trip not found');
      }

      // Update trip location
      trip.currentLocation = {
        type: 'Point',
        coordinates: [locationData.lng, locationData.lat],
        timestamp: new Date(),
        speed: locationData.speed || trip.currentLocation.speed,
        heading: locationData.heading || trip.currentLocation.heading,
        accuracy: locationData.accuracy || trip.currentLocation.accuracy
      };

      // Update vehicle location
      await Vehicle.findByIdAndUpdate(trip.vehicleId, {
        currentLocation: trip.currentLocation,
        lastActive: new Date()
      });

      // Recalculate ETAs
      await etaService.calculateTripETAs(tripId);

      await trip.save();

      return {
        success: true,
        data: trip
      };
    } catch (error) {
      console.error('Update trip location error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update passenger count
  async updatePassengerCount(tripId, passengerCount) {
    try {
      const trip = await Trip.findById(tripId);
      if (!trip) {
        throw new Error('Trip not found');
      }

      const vehicle = await Vehicle.findById(trip.vehicleId);
      if (!vehicle) {
        throw new Error('Vehicle not found');
      }

      // Validate capacity
      if (passengerCount > vehicle.capacity) {
        throw new Error('Passenger count exceeds vehicle capacity');
      }

      trip.passengerCount = passengerCount;

      // Update crowd level based on capacity
      const utilization = (passengerCount / vehicle.capacity) * 100;
      if (utilization < 20) trip.crowdLevel = 'empty';
      else if (utilization < 40) trip.crowdLevel = 'low';
      else if (utilization < 60) trip.crowdLevel = 'half';
      else if (utilization < 80) trip.crowdLevel = 'high';
      else if (utilization < 100) trip.crowdLevel = 'full';
      else trip.crowdLevel = 'standing';

      await trip.save();

      return {
        success: true,
        data: trip
      };
    } catch (error) {
      console.error('Update passenger count error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // End trip and calculate statistics
  async endTrip(tripId, endData = {}) {
    try {
      const trip = await Trip.findById(tripId);
      if (!trip) {
        throw new Error('Trip not found');
      }

      // Update trip status
      trip.status = 'completed';
      trip.endTime = new Date();
      
      // Add end data if provided
      if (endData.location) {
        trip.currentLocation = {
          ...trip.currentLocation,
          coordinates: [endData.location.lng, endData.location.lat],
          timestamp: new Date()
        };
      }

      // Calculate statistics
      const durationMinutes = Math.round((trip.endTime - trip.startTime) / 60000);
      trip.statistics.duration = durationMinutes;

      // Calculate revenue (this would come from reservations)
      const reservations = await require('../models/Reservation').find({
        tripId: trip._id,
        status: { $in: ['confirmed', 'boarded', 'completed'] }
      });

      const totalRevenue = reservations.reduce((sum, res) => sum + (res.fare || 0), 0);
      trip.revenue = totalRevenue;

      await trip.save();

      // Update vehicle status
      await Vehicle.findByIdAndUpdate(trip.vehicleId, {
        status: 'offline',
        currentLocation: trip.currentLocation
      });

      // Update driver status
      await User.findByIdAndUpdate(trip.driverId, {
        lastActive: new Date()
      });

      return {
        success: true,
        data: trip
      };
    } catch (error) {
      console.error('End trip error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Cancel trip
  async cancelTrip(tripId, cancellationReason) {
    try {
      const trip = await Trip.findById(tripId);
      if (!trip) {
        throw new Error('Trip not found');
      }

      // Can only cancel scheduled or boarding trips
      if (!['scheduled', 'boarding'].includes(trip.status)) {
        throw new Error(`Cannot cancel trip with status: ${trip.status}`);
      }

      trip.status = 'cancelled';
      trip.endTime = new Date();

      // Add cancellation reason as incident
      if (cancellationReason) {
        trip.incidents.push({
          type: 'cancellation',
          description: cancellationReason,
          timestamp: new Date(),
          reportedBy: trip.driverId,
          resolved: true
        });
      }

      await trip.save();

      // Update vehicle status
      await Vehicle.findByIdAndUpdate(trip.vehicleId, {
        status: 'offline'
      });

      // Notify passengers
      const reservations = await require('../models/Reservation').find({
        tripId: trip._id,
        status: { $in: ['confirmed', 'pending'] }
      });

      for (const reservation of reservations) {
        await notificationService.sendPushNotification(
          reservation.passengerId,
          'Trip Cancelled',
          `Your trip on ${trip.routeId?.name || 'this route'} has been cancelled.`,
          {
            type: 'trip_cancelled',
            tripId: trip._id.toString(),
            reservationId: reservation._id.toString()
          }
        );
      }

      return {
        success: true,
        data: trip
      };
    } catch (error) {
      console.error('Cancel trip error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Find nearby trips
  async findNearbyTrips(lat, lng, radius = 2000, filters = {}) {
    try {
      const query = {
        status: { $in: ['boarding', 'active'] },
        'currentLocation.coordinates': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat]
            },
            $maxDistance: radius
          }
        }
      };

      // Apply filters
      if (filters.routeId) query.routeId = filters.routeId;
      if (filters.saccoId) query.saccoId = filters.saccoId;
      if (filters.vehicleId) query.vehicleId = filters.vehicleId;
      if (filters.crowdLevel) query.crowdLevel = filters.crowdLevel;

      const trips = await Trip.find(query)
        .populate('vehicleId', 'plateNumber capacity features')
        .populate('driverId', 'name avatar')
        .populate('saccoId', 'name logo')
        .populate('routeId', 'name origin destination')
        .limit(50);

      // Calculate distance and ETA for each trip
      const tripsWithDetails = trips.map(trip => {
        const tripObj = trip.toObject();
        const tripLat = trip.currentLocation.coordinates[1];
        const tripLng = trip.currentLocation.coordinates[0];
        
        // Calculate distance
        tripObj.distance = calculateDistance([lng, lat], [tripLng, tripLat]);
        
        // Calculate ETA (rough estimate)
        const distanceKm = tripObj.distance / 1000;
        const averageSpeed = trip.currentLocation.speed || 30; // km/h
        const etaMinutes = Math.round((distanceKm / averageSpeed) * 60);
        
        tripObj.etaMinutes = Math.max(etaMinutes, 1);
        
        return tripObj;
      });

      // Sort by distance
      tripsWithDetails.sort((a, b) => a.distance - b.distance);

      return {
        success: true,
        data: tripsWithDetails
      };
    } catch (error) {
      console.error('Find nearby trips error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get trip analytics for dashboard
  async getDashboardAnalytics(userId, userRole, filters = {}) {
    try {
      let query = {};

      // Filter based on user role
      if (userRole === 'driver') {
        query.driverId = userId;
      } else if (userRole === 'sacco_admin') {
        const user = await User.findById(userId);
        if (user.saccoId) {
          query.saccoId = user.saccoId;
        }
      }

      // Apply date filters
      if (filters.startDate || filters.endDate) {
        query.createdAt = {};
        if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
        if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
      }

      // Get today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);

      // Get statistics
      const todayTrips = await Trip.find({
        ...query,
        createdAt: { $gte: today, $lt: tomorrow },
        status: 'completed'
      });

      const weekTrips = await Trip.find({
        ...query,
        createdAt: { $gte: weekAgo },
        status: 'completed'
      });

      const activeTrips = await Trip.find({
        ...query,
        status: { $in: ['boarding', 'active'] }
      });

      // Calculate statistics
      const calculateStats = (trips) => ({
        count: trips.length,
        revenue: trips.reduce((sum, t) => sum + (t.revenue || 0), 0),
        passengers: trips.reduce((sum, t) => sum + (t.passengerCount || 0), 0),
        distance: trips.reduce((sum, t) => sum + (t.statistics.totalDistance || 0), 0)
      });

      const stats = {
        today: calculateStats(todayTrips),
        week: calculateStats(weekTrips),
        active: {
          count: activeTrips.length,
          trips: activeTrips
        }
      };

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      console.error('Get dashboard analytics error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Check if trip is on route
  async validateTripOnRoute(tripId) {
    try {
      const trip = await Trip.findById(tripId)
        .populate('routeId', 'path stages');

      if (!trip || !trip.routeId) {
        return { success: false, error: 'Trip or route not found' };
      }

      const currentLocation = trip.currentLocation.coordinates;
      const routePath = trip.routeId.path;

      // Simple validation - check if current location is within reasonable distance of route
      // In production, you would use more sophisticated geospatial queries
      let isOnRoute = false;
      let distanceToRoute = Infinity;

      if (routePath && routePath.coordinates) {
        for (const point of routePath.coordinates) {
          const distance = calculateDistance(currentLocation, point);
          if (distance < distanceToRoute) {
            distanceToRoute = distance;
          }
        }

        isOnRoute = distanceToRoute < 500; // Within 500 meters of route
      }

      return {
        success: true,
        data: {
          isOnRoute,
          distanceToRoute,
          currentLocation,
          routeId: trip.routeId._id
        }
      };
    } catch (error) {
      console.error('Validate trip on route error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate trip report
  async generateTripReport(tripId) {
    try {
      const trip = await Trip.findById(tripId)
        .populate('vehicleId', 'plateNumber capacity make model')
        .populate('driverId', 'name phone')
        .populate('saccoId', 'name registrationNumber')
        .populate('routeId', 'name origin destination')
        .populate({
          path: 'incidents.reportedBy',
          select: 'name'
        });

      if (!trip) {
        throw new Error('Trip not found');
      }

      // Get reservations
      const Reservation = require('../models/Reservation');
      const reservations = await Reservation.find({
        tripId: trip._id
      })
        .populate('passengerId', 'name phone')
        .sort('stageIndex');

      // Calculate detailed statistics
      const duration = trip.statistics.duration || 0;
      const revenue = trip.revenue || 0;
      const passengerCount = trip.passengerCount || 0;
      const distance = trip.statistics.totalDistance || 0;

      const report = {
        tripId: trip._id,
        basicInfo: {
          route: trip.routeId?.name,
          vehicle: trip.vehicleId?.plateNumber,
          driver: trip.driverId?.name,
          sacco: trip.saccoId?.name,
          status: trip.status,
          startTime: trip.startTime,
          endTime: trip.endTime,
          duration: `${duration} minutes`
        },
        statistics: {
          revenue: revenue,
          passengerCount: passengerCount,
          distance: `${distance} km`,
          revenuePerPassenger: passengerCount > 0 ? (revenue / passengerCount).toFixed(2) : 0,
          avgSpeed: duration > 0 ? ((distance / duration) * 60).toFixed(1) + ' km/h' : 'N/A'
        },
        passengers: reservations.map(res => ({
          name: res.passengerId?.name,
          phone: res.passengerId?.phone,
          stage: res.stageIndex,
          fare: res.fare,
          status: res.status
        })),
        incidents: trip.incidents.map(inc => ({
          type: inc.type,
          description: inc.description,
          time: inc.timestamp,
          reportedBy: inc.reportedBy?.name,
          resolved: inc.resolved
        })),
        timeline: {
          scheduled: trip.scheduledStartTime,
          started: trip.startTime,
          ended: trip.endTime
        }
      };

      return {
        success: true,
        data: report
      };
    } catch (error) {
      console.error('Generate trip report error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new TripService();