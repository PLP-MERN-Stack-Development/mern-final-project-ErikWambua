const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
    unique: true,
    validate: {
      validator: function(v) {
        // Accept both local (07/01) and international (+254) formats
        return /^(07|01)\d{8}$/.test(v) || /^\+2547\d{8}$/.test(v) || /^\+2541\d{8}$/.test(v);
      },
      message: props => `${props.value} is not a valid Kenyan phone number!`
    }
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['passenger', 'driver', 'sacco_admin', 'super_admin'],
    default: 'passenger'
  },
  avatar: {
    type: String,
    default: 'default-avatar.jpg'
  },
  saccoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sacco'
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  fcmToken: String,
  language: {
    type: String,
    enum: ['en', 'sw'],
    default: 'en'
  },
  favorites: [{
    routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
    stageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route.stages' },
    addedAt: { type: Date, default: Date.now }
  }],
  lastLogin: Date,
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'online', 'offline'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

module.exports = mongoose.model('User', userSchema);