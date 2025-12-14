const express = require('express');
const {
  initiateSTKPush,
  mpesaCallback,
  checkPaymentStatus,
  getPaymentHistory
} = require('../controllers/paymentController');

const router = express.Router();

const { protect } = require('../middleware/auth');

// Protected routes (require authentication)
router.post('/mpesa/stk-push', protect, initiateSTKPush);
router.get('/status/:checkoutRequestId', protect, checkPaymentStatus);
router.get('/history', protect, getPaymentHistory);

// Public callback (called by Safaricom)
router.post('/mpesa/callback', mpesaCallback);

module.exports = router;