const axios = require('axios');
const User = require('../models/User');

// Send push notification via FCM
exports.sendPushNotification = async (userId, title, body, data = {}) => {
  try {
    const user = await User.findById(userId).select('fcmToken language');
    
    if (!user || !user.fcmToken) {
      return;
    }

    const message = {
      to: user.fcmToken,
      notification: {
        title,
        body,
        sound: 'default'
      },
      data: {
        ...data,
        click_action: 'FLUTTER_NOTIFICATION_CLICK'
      }
    };

    const response = await axios.post('https://fcm.googleapis.com/fcm/send', message, {
      headers: {
        'Authorization': `key=${process.env.FCM_SERVER_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Push notification failed:', error.message);
  }
};

// Send SMS notification (using Africa's Talking)
exports.sendSMS = async (phone, message) => {
  try {
    const response = await axios.post(
      'https://api.africastalking.com/version1/messaging',
      {
        username: process.env.AT_USERNAME,
        to: phone,
        message: message,
        from: 'MatPulse'
      },
      {
        headers: {
          'ApiKey': process.env.AT_API_KEY,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('SMS sending failed:', error.message);
  }
};

// Send trip reminder
exports.sendTripReminder = async (reservationId) => {
  try {
    const Reservation = require('../models/Reservation');
    
    const reservation = await Reservation.findById(reservationId)
      .populate('passengerId', 'fcmToken phone name')
      .populate('tripId', 'routeId')
      .populate({
        path: 'tripId',
        populate: {
          path: 'routeId',
          select: 'name'
        }
      });

    if (!reservation) return;

    const { passengerId, tripId } = reservation;
    const routeName = tripId.routeId.name;

    // Send push notification
    await this.sendPushNotification(
      passengerId._id,
      'Trip Reminder',
      `Your matatu on ${routeName} is arriving soon. Be at your stage in 5 minutes.`,
      {
        type: 'trip_reminder',
        reservationId: reservation._id.toString(),
        tripId: tripId._id.toString()
      }
    );

    // Send SMS if no FCM token
    if (!passengerId.fcmToken) {
      await this.sendSMS(
        passengerId.phone,
        `MatPulse: Your matatu on ${routeName} is arriving soon. Be at your stage in 5 minutes.`
      );
    }
  } catch (error) {
    console.error('Trip reminder failed:', error);
  }
};

// Send payment confirmation
exports.sendPaymentConfirmation = async (reservationId) => {
  try {
    const Reservation = require('../models/Reservation');
    
    const reservation = await Reservation.findById(reservationId)
      .populate('passengerId', 'fcmToken phone name');

    if (!reservation) return;

    const { passengerId, fare, code } = reservation;

    // Send push notification
    await this.sendPushNotification(
      passengerId._id,
      'Payment Confirmed',
      `Your payment of KSh ${fare} for reservation ${code} has been confirmed.`,
      {
        type: 'payment_confirmation',
        reservationId: reservation._id.toString(),
        amount: fare
      }
    );
  } catch (error) {
    console.error('Payment confirmation failed:', error);
  }
};

// Send alert notification to nearby users
exports.sendAlertNotification = async (alert, userIds) => {
  try {
    const users = await User.find({ _id: { $in: userIds } }).select('fcmToken');

    for (const user of users) {
      if (user.fcmToken) {
        await this.sendPushNotification(
          user._id,
          `Alert: ${alert.type}`,
          alert.description || `New ${alert.type} reported in your area`,
          {
            type: 'alert',
            alertId: alert._id.toString(),
            alertType: alert.type
          }
        );
      }
    }
  } catch (error) {
    console.error('Alert notification failed:', error);
  }
};