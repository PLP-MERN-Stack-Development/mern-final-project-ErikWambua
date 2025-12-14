const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  passengerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  stageId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  stageIndex: {
    type: Number,
    required: true
  },
  pickupStage: {
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
  fare: {
    type: Number,
    required: true,
    min: 0
  },
  code: {
    type: String,
    unique: true,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'boarded', 'completed', 'cancelled', 'expired'],
    default: 'pending'
  },
  payment: {
    method: {
      type: String,
      enum: ['mpesa', 'cash', 'wallet'],
      default: 'mpesa'
    },
    mpesaCode: String,
    amount: Number,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    completedAt: Date
  },
  qrCode: String,
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }
  },
  boardedAt: Date,
  completedAt: Date,
  cancellationReason: String,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: String
}, {
  timestamps: true
});

// Create compound indexes
reservationSchema.index({ passengerId: 1, status: 1 });
reservationSchema.index({ tripId: 1, status: 1 });
reservationSchema.index({ code: 1 }, { unique: true });

module.exports = mongoose.model('Reservation', reservationSchema);