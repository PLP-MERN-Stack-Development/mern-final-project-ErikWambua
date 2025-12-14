const mongoose = require('mongoose');

const saccoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sacco name is required'],
    trim: true
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  description: String,
  logo: {
    type: String,
    default: 'default-sacco-logo.png'
  },
  contactPhone: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^(07|01)\d{8}$/.test(v);
      }
    }
  },
  contactEmail: String,
  headquarters: {
    type: String,
    required: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  subscription: {
    type: {
      plan: {
        type: String,
        enum: ['basic', 'premium', 'enterprise'],
        default: 'basic'
      },
      status: {
        type: String,
        enum: ['active', 'expired', 'cancelled'],
        default: 'active'
      },
      expiresAt: Date,
      paymentMethod: String
    }
  },
  routes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route'
  }],
  vehicles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  }],
  performance: {
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalTrips: {
      type: Number,
      default: 0
    },
    onTimePercentage: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Sacco', saccoSchema);