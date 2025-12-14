const mongoose = require('mongoose');
const mongooseGeojsonSchema = require('mongoose-geojson-schema');

const routeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  nickname: {
    type: String,
    trim: true
  },
  saccoIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sacco'
  }],
  origin: {
    name: String,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number]
    }
  },
  destination: {
    name: String,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number]
    }
  },
  path: mongoose.Schema.Types.LineString,
  totalDistance: {
    type: Number, // in kilometers
    default: 0
  },
  estimatedDuration: {
    type: Number, // in minutes
    default: 0
  },
  stages: [{
    name: {
      type: String,
      required: true
    },
    alias: String,
    description: String,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number]
    },
    sequence: {
      type: Number,
      required: true
    },
    isPickupPoint: {
      type: Boolean,
      default: true
    },
    isDropoffPoint: {
      type: Boolean,
      default: true
    },
    landmarks: [String]
  }],
  fareStructure: {
    baseFare: {
      type: Number,
      required: true,
      min: 0
    },
    peakMultiplier: {
      type: Number,
      default: 1.2
    },
    stageIncrements: [{
      fromStage: Number,
      toStage: Number,
      fare: Number
    }]
  },
  operatingHours: {
    start: {
      type: String,
      default: '05:00'
    },
    end: {
      type: String,
      default: '23:00'
    },
    days: [{
      type: String,
      enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
    }]
  },
  peakHours: [{
    start: String,
    end: String,
    multiplier: Number
  }],
  popularity: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Create geospatial index for route path
routeSchema.index({ path: '2dsphere' });

// Create index for stages location
routeSchema.index({ 'stages.location': '2dsphere' });

module.exports = mongoose.model('Route', routeSchema);