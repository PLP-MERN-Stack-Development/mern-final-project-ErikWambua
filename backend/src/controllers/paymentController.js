const axios = require('axios');
const crypto = require('crypto');
const Reservation = require('../models/Reservation');

// M-Pesa Daraja API Configuration
const MPESA_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke';

// Generate M-Pesa access token
const generateAccessToken = async () => {
  try {
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString('base64');

    const response = await axios.get(
      `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`
        }
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Failed to generate access token:', error.message);
    throw error;
  }
};

// Generate password for STK Push
const generatePassword = (shortcode, passkey, timestamp) => {
  const password = Buffer.from(shortcode + passkey + timestamp).toString('base64');
  return password;
};

// Generate timestamp in yyyyMMddHHmmss format
const generateTimestamp = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

// @desc    Initiate M-Pesa STK Push
// @route   POST /api/payments/mpesa/stk-push
// @access  Private
exports.initiateSTKPush = async (req, res) => {
  try {
    const { phone, amount, reservationId } = req.body;

    // Validate reservation exists
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // Validate user owns reservation
    if (reservation.passengerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Format phone number (remove leading 0, add country code)
    let formattedPhone = phone.replace(/^0/, '254');
    if (!formattedPhone.startsWith('254')) {
      formattedPhone = `254${formattedPhone}`;
    }

    const timestamp = generateTimestamp();
    const password = generatePassword(
      process.env.MPESA_SHORTCODE,
      process.env.MPESA_PASSKEY,
      timestamp
    );

    const accessToken = await generateAccessToken();

    const requestBody = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: formattedPhone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: `MATPULSE${reservation.code}`,
      TransactionDesc: `MatPulse Reservation ${reservation.code}`
    };

    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Update reservation with payment request data
    reservation.payment.mpesaRequestId = response.data.CheckoutRequestID;
    reservation.payment.mpesaMerchantRequestId = response.data.MerchantRequestID;
    reservation.payment.requestedAt = new Date();
    await reservation.save();

    res.status(200).json({
      success: true,
      message: 'Payment request sent to your phone',
      data: {
        checkoutRequestId: response.data.CheckoutRequestID,
        merchantRequestId: response.data.MerchantRequestID,
        responseCode: response.data.ResponseCode,
        responseDescription: response.data.ResponseDescription,
        customerMessage: response.data.CustomerMessage
      }
    });
  } catch (error) {
    console.error('STK Push failed:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    M-Pesa callback URL (webhook)
// @route   POST /api/payments/mpesa/callback
// @access  Public (called by Safaricom)
exports.mpesaCallback = async (req, res) => {
  try {
    const callbackData = req.body;

    // Safaricom sends data in Body.stkCallback
    const stkCallback = callbackData.Body.stkCallback;

    if (!stkCallback) {
      return res.status(400).json({
        success: false,
        message: 'Invalid callback data'
      });
    }

    const checkoutRequestId = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;

    // Find reservation by checkout request ID
    const reservation = await Reservation.findOne({
      'payment.mpesaRequestId': checkoutRequestId
    });

    if (!reservation) {
      console.error('Reservation not found for checkout request:', checkoutRequestId);
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    if (resultCode === 0) {
      // Payment successful
      const callbackMetadata = stkCallback.CallbackMetadata;
      const metadataItems = callbackMetadata?.Item || [];

      let mpesaReceiptNumber, amount, phoneNumber, transactionDate;

      // Extract metadata
      metadataItems.forEach(item => {
        switch (item.Name) {
          case 'MpesaReceiptNumber':
            mpesaReceiptNumber = item.Value;
            break;
          case 'Amount':
            amount = item.Value;
            break;
          case 'PhoneNumber':
            phoneNumber = item.Value;
            break;
          case 'TransactionDate':
            transactionDate = item.Value;
            break;
        }
      });

      // Update reservation
      reservation.payment.status = 'completed';
      reservation.payment.mpesaCode = mpesaReceiptNumber;
      reservation.payment.amount = amount;
      reservation.payment.completedAt = new Date();
      reservation.status = 'confirmed';
      await reservation.save();

      // TODO: Send confirmation notification to passenger
      // TODO: Update trip passenger count

      console.log(`Payment successful for reservation ${reservation.code}: ${mpesaReceiptNumber}`);
    } else {
      // Payment failed
      reservation.payment.status = 'failed';
      reservation.payment.failedAt = new Date();
      reservation.payment.failureReason = resultDesc;
      await reservation.save();

      console.log(`Payment failed for reservation ${reservation.code}: ${resultDesc}`);
    }

    // Acknowledge receipt to Safaricom
    res.status(200).json({
      ResultCode: 0,
      ResultDesc: 'Success'
    });
  } catch (error) {
    console.error('Callback processing failed:', error);
    res.status(500).json({
      ResultCode: 1,
      ResultDesc: 'Failed'
    });
  }
};

// @desc    Check payment status
// @route   GET /api/payments/status/:checkoutRequestId
// @access  Private
exports.checkPaymentStatus = async (req, res) => {
  try {
    const { checkoutRequestId } = req.params;

    const accessToken = await generateAccessToken();

    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`,
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: generatePassword(
          process.env.MPESA_SHORTCODE,
          process.env.MPESA_PASSKEY,
          generateTimestamp()
        ),
        Timestamp: generateTimestamp(),
        CheckoutRequestID: checkoutRequestId
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const resultCode = response.data.ResultCode;
    const resultDesc = response.data.ResultDesc;

    // Find reservation
    const reservation = await Reservation.findOne({
      'payment.mpesaRequestId': checkoutRequestId
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        resultCode,
        resultDesc,
        reservation: {
          id: reservation._id,
          status: reservation.status,
          paymentStatus: reservation.payment.status
        }
      }
    });
  } catch (error) {
    console.error('Payment status check failed:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to check payment status'
    });
  }
};

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
exports.getPaymentHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const query = {
      'passengerId': req.user.id,
      'payment.status': 'completed'
    };

    const skip = (page - 1) * limit;

    const payments = await Reservation.find(query)
      .select('code fare payment status createdAt')
      .populate('tripId', 'routeId')
      .populate({
        path: 'tripId',
        populate: {
          path: 'routeId',
          select: 'name'
        }
      })
      .sort({ 'payment.completedAt': -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Reservation.countDocuments(query);

    // Calculate totals
    const totalAmount = payments.reduce((sum, payment) => sum + (payment.fare || 0), 0);
    const totalPayments = payments.length;

    res.status(200).json({
      success: true,
      count: payments.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      summary: {
        totalAmount,
        totalPayments,
        averageAmount: totalPayments > 0 ? (totalAmount / totalPayments).toFixed(2) : 0
      },
      data: payments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment history'
    });
  }
};