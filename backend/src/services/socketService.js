const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let io;

exports.initSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST']
    }
  });

  // Middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id} (User: ${socket.user.name})`);

    // Join trip room
    socket.on('join:trip', (tripId) => {
      socket.join(`trip:${tripId}`);
      console.log(`Socket ${socket.id} joined trip:${tripId}`);
    });

    // Leave trip room
    socket.on('leave:trip', (tripId) => {
      socket.leave(`trip:${tripId}`);
      console.log(`Socket ${socket.id} left trip:${tripId}`);
    });

    // Join route room
    socket.on('join:route', (routeId) => {
      socket.join(`route:${routeId}`);
      console.log(`Socket ${socket.id} joined route:${routeId}`);
    });

    // Trip location updates from drivers
    socket.on('trip:location:update', async (data) => {
      try {
        const { tripId, location } = data;
        
        // Verify driver owns the trip
        const Trip = require('../models/Trip');
        const trip = await Trip.findById(tripId);
        if (!trip || trip.driverId.toString() !== socket.user.id) {
          return socket.emit('error', { message: 'Not authorized' });
        }

        // Update trip location in database
        const tripService = require('./tripService');
        await tripService.updateTripLocation(tripId, location);

        // Broadcast to all clients in the trip room
        io.to(`trip:${tripId}`).emit('trip:location:update', {
          tripId,
          location: {
            coordinates: [location.lng, location.lat],
            timestamp: new Date()
          }
        });

        // Also emit to route room for passengers tracking this route
        io.to(`route:${trip.routeId}`).emit('trip:location:update', {
          tripId,
          location: {
            coordinates: [location.lng, location.lat],
            timestamp: new Date()
          }
        });

      } catch (error) {
        console.error('Trip location update error:', error);
        socket.emit('error', { message: 'Failed to update location' });
      }
    });

    // Trip status updates
    socket.on('trip:status:update', async (data) => {
      try {
        const { tripId, status, reason } = data;
        
        // Verify driver owns the trip
        const Trip = require('../models/Trip');
        const trip = await Trip.findById(tripId);
        if (!trip || trip.driverId.toString() !== socket.user.id) {
          return socket.emit('error', { message: 'Not authorized' });
        }

        // Update trip status
        const tripService = require('./tripService');
        await tripService.updateTripStatus(tripId, status, reason);

        // Broadcast status change
        io.to(`trip:${tripId}`).emit('trip:status:change', {
          tripId,
          status,
          reason,
          timestamp: new Date()
        });

      } catch (error) {
        console.error('Trip status update error:', error);
        socket.emit('error', { message: 'Failed to update status' });
      }
    });

    // Crowd level updates
    socket.on('trip:crowd:update', async (data) => {
      try {
        const { tripId, crowdLevel, passengerCount } = data;
        
        // Verify driver owns the trip
        const Trip = require('../models/Trip');
        const trip = await Trip.findById(tripId);
        if (!trip || trip.driverId.toString() !== socket.user.id) {
          return socket.emit('error', { message: 'Not authorized' });
        }

        // Update crowd level
        const tripService = require('./tripService');
        await tripService.updatePassengerCount(tripId, passengerCount);

        // Broadcast crowd update
        io.to(`trip:${tripId}`).emit('trip:crowd:update', {
          tripId,
          crowdLevel,
          passengerCount,
          timestamp: new Date()
        });

      } catch (error) {
        console.error('Crowd update error:', error);
        socket.emit('error', { message: 'Failed to update crowd level' });
      }
    });

    // Trip incident reporting
    socket.on('trip:incident:report', async (data) => {
      try {
        const { tripId, type, description } = data;
        
        // Verify driver owns the trip
        const Trip = require('../models/Trip');
        const trip = await Trip.findById(tripId);
        if (!trip || trip.driverId.toString() !== socket.user.id) {
          return socket.emit('error', { message: 'Not authorized' });
        }

        // Add incident
        trip.incidents.push({
          type,
          description,
          location: trip.currentLocation,
          timestamp: new Date(),
          reportedBy: socket.user.id,
          resolved: false
        });

        await trip.save();

        // Broadcast incident
        io.to(`trip:${tripId}`).emit('trip:incident:reported', {
          tripId,
          incident: {
            type,
            description,
            timestamp: new Date()
          }
        });

      } catch (error) {
        console.error('Incident report error:', error);
        socket.emit('error', { message: 'Failed to report incident' });
      }
    });

    // Request trip data
    socket.on('trip:data:request', async (data) => {
      try {
        const { tripId } = data;
        
        const Trip = require('../models/Trip');
        const trip = await Trip.findById(tripId)
          .populate('vehicleId', 'plateNumber capacity')
          .populate('driverId', 'name')
          .populate('routeId', 'name');

        if (!trip) {
          return socket.emit('error', { message: 'Trip not found' });
        }

        // Send trip data to requesting client
        socket.emit('trip:data:response', {
          tripId,
          data: trip
        });

      } catch (error) {
        console.error('Trip data request error:', error);
        socket.emit('error', { message: 'Failed to fetch trip data' });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      
      // Handle driver going offline
      if (socket.user.role === 'driver') {
        // Mark driver as offline if they have no active trips
        const Trip = require('../models/Trip');
        Trip.findOne({
          driverId: socket.user.id,
          status: { $in: ['boarding', 'active'] }
        }).then(activeTrip => {
          if (!activeTrip) {
            User.findByIdAndUpdate(socket.user.id, {
              status: 'offline',
              lastActive: new Date()
            }).catch(console.error);
          }
        }).catch(console.error);
      }
    });
  });

  return io;
};

// Helper function to emit events from controllers
exports.emitToRoom = (room, event, data) => {
  if (io) {
    io.to(room).emit(event, data);
  }
};

exports.emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

exports.emitToAll = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};