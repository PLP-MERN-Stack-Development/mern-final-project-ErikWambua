const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  plateNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    validate: {
      validator: function(v) {
        // Kenyan plate format: KBC 123A, KAA 001A, KBX 123X
        return /^[A-Z]{3}\s\d{3}[A-Z]$/.test(v);
      },
      message: props => `${props.value} is not a valid Kenyan plate number!`
    }
  },
  saccoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sacco',
    required: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  make: String,
  model: String,
  year: Number,
  color: String,
  capacity: {
    type: Number,
    required: true,
    min: 14,
    max: 33 // Typical matatu capacity
  },
  features: [{
    type: String,
    enum: ['wifi', 'ac', 'charging', 'tv', 'music', 'first_aid', 'wheelchair']
  }],
  photos: [String],
  insurance: {
    provider: String,
    policyNumber: String,
    expiryDate: Date
  },
  inspection: {
    lastInspection: Date,
    nextInspection: Date,
    status: {
      type: String,
      enum: ['valid', 'expired', 'pending'],
      default: 'pending'
    }
  },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'offline', 'decommissioned'],
    default: 'offline'
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  lastActive: Date
}, {
  timestamps: true
});

// Create 2dsphere index for location queries
vehicleSchema.index({ currentLocation: '2dsphere' });

module.exports = mongoose.model('Vehicle', vehicleSchema);