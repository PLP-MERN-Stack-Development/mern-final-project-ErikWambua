const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  saccoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sacco',
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'boarding', 'active', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  scheduledStartTime: Date,
  endTime: Date,
  currentStageIndex: {
    type: Number,
    default: 0
  },
  nextStageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route.stages'
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    speed: {
      type: Number, // km/h
      default: 0
    },
    heading: {
      type: Number, // degrees from north
      min: 0,
      max: 360
    },
    accuracy: Number // in meters
  },
  crowdLevel: {
    type: String,
    enum: ['empty', 'low', 'half', 'high', 'full', 'standing'],
    default: 'empty'
  },
  passengerCount: {
    type: Number,
    default: 0,
    min: 0
  },
  stageETAs: [{
    stageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route.stages'
    },
    stageIndex: Number,
    estimatedArrival: Date,
    distanceRemaining: Number, // in meters
    updatedAt: Date
  }],
  statistics: {
    totalDistance: {
      type: Number,
      default: 0
    },
    averageSpeed: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number, // in minutes
      default: 0
    }
  },
  revenue: {
    type: Number,
    default: 0,
    min: 0
  },
  incidents: [{
    type: {
      type: String,
      enum: ['breakdown', 'accident', 'police_stop', 'traffic']
    },
    description: String,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number]
    },
    timestamp: Date,
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolved: {
      type: Boolean,
      default: false
    }
  }],
  
  notes: {
    type: String,
    maxlength: 500
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  isPeakHour: {
    type: Boolean,
    default: false
  },
  
  weatherConditions: {
    type: String,
    enum: ['clear', 'rain', 'fog', 'haze', 'storm'],
    default: 'clear'
  },
  
  trafficConditions: {
    type: String,
    enum: ['clear', 'moderate', 'heavy', 'gridlock'],
    default: 'clear'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create compound index for active trips query
tripSchema.index({ status: 1, saccoId: 1 });
tripSchema.index({ currentLocation: '2dsphere' });
tripSchema.index({ driverId: 1, startTime: -1 });
tripSchema.index({ routeId: 1, status: 1 });
tripSchema.index({ vehicleId: 1, status: 1 });
tripSchema.index({ createdAt: -1 });

// Virtual for trip duration
tripSchema.virtual('durationMinutes').get(function() {
  if (this.startTime && this.endTime) {
    return Math.round((this.endTime - this.startTime) / 60000);
  }
  return null;
});

// Virtual for revenue per passenger
tripSchema.virtual('revenuePerPassenger').get(function() {
  if (this.revenue && this.passengerCount > 0) {
    return this.revenue / this.passengerCount;
  }
  return 0;
});

// Method to check if trip is on time
tripSchema.methods.isOnTime = function() {
  if (!this.scheduledStartTime || !this.startTime) return null;
  const delay = (this.startTime - this.scheduledStartTime) / 60000; // minutes
  return delay <= 10; // Consider on time if within 10 minutes
};

// Pre-save middleware
tripSchema.pre('save', function(next) {
  // Check if it's peak hour (7-9 AM or 5-7 PM)
  const hour = new Date().getHours();
  this.isPeakHour = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
  
  // Update updatedBy on save
  if (this.isModified()) {
    this.updatedBy = this._context ? this._context.userId : null;
  }
  
  next();
});

// Post-save middleware for real-time updates
tripSchema.post('save', function(doc) {
  // Emit socket event for real-time updates
  try {
    const io = require('../config/socket').getIO();
    if (io) {
      io.to(`trip:${doc._id}`).emit('trip:update', {
        tripId: doc._id,
        status: doc.status,
        location: doc.currentLocation,
        passengerCount: doc.passengerCount,
        updatedAt: doc.updatedAt
      });
    }
  } catch (error) {
    // Socket may not be initialized yet, silently continue
  }
});

module.exports = mongoose.model('Trip', tripSchema);