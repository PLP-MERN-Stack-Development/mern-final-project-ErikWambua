const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['police', 'accident', 'traffic_jam', 'roadblock', 'protest', 'flooding', 'breakdown', 'other'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: String,
    landmark: String
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  verifiedBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  verificationScore: {
    type: Number,
    default: 1,
    min: 1
  },
  routeIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route'
  }],
  media: [{
    type: String, // URLs to photos/videos
    description: String
  }],
  status: {
    type: String,
    enum: ['active', 'resolved', 'expired', 'false_report'],
    default: 'active'
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours default
  },
  resolvedAt: Date,
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolutionNotes: String,
  stats: {
    views: {
      type: Number,
      default: 0
    },
    confirmations: {
      type: Number,
      default: 0
    },
    reports: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Create geospatial index for location queries
alertSchema.index({ location: '2dsphere' });
alertSchema.index({ status: 1, expiresAt: 1 });
alertSchema.index({ type: 1, severity: 1 });

module.exports = mongoose.model('Alert', alertSchema);