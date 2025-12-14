import toast from 'react-hot-toast';
import { endpoints } from './api';

class NotificationService {
  constructor() {
    this.permission = null;
    this.notificationSound = null;
    this.vibrationEnabled = true;
    this.soundEnabled = true;
    this.notificationQueue = [];
    this.isProcessingQueue = false;

    this.loadSettings();
    this.initSound();
  }

  loadSettings() {
    try {
      const settings = JSON.parse(localStorage.getItem('notificationSettings') || '{}');
      this.vibrationEnabled = settings.vibrationEnabled !== false;
      this.soundEnabled = settings.soundEnabled !== false;
      this.permission = settings.permission || null;
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  }

  saveSettings() {
    try {
      const settings = {
        vibrationEnabled: this.vibrationEnabled,
        soundEnabled: this.soundEnabled,
        permission: this.permission
      };
      localStorage.setItem('notificationSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  }

  initSound() {
    if (typeof Audio !== 'undefined') {
      this.notificationSound = new Audio('/sounds/notification.mp3');
      // Fallback to a simple beep if custom sound fails
      this.notificationSound.onerror = () => {
        this.notificationSound = null;
      };
    }
  }

  async requestPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return 'unsupported';
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      this.saveSettings();
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }

  playSound() {
    if (this.soundEnabled && this.notificationSound) {
      try {
        this.notificationSound.currentTime = 0;
        this.notificationSound.play().catch(error => {
          console.error('Error playing notification sound:', error);
        });
      } catch (error) {
        console.error('Error playing sound:', error);
      }
    }
  }

  vibrate(pattern = [200, 100, 200]) {
    if (this.vibrationEnabled && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (error) {
        console.error('Error vibrating:', error);
      }
    }
  }

  showNativeNotification(title, options = {}) {
    if (this.permission !== 'granted') {
      return null;
    }

    const defaultOptions = {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      requireInteraction: false,
      silent: !this.soundEnabled,
      tag: 'matatu-tracker',
      vibrate: this.vibrationEnabled ? [200, 100, 200] : [],
      ...options
    };

    try {
      const notification = new Notification(title, defaultOptions);

      // Handle click
      notification.onclick = () => {
        window.focus();
        notification.close();
        
        if (options.data?.url) {
          window.location.href = options.data.url;
        }
      };

      // Handle close
      notification.onclose = () => {
        console.log('Notification closed');
      };

      // Auto close after 10 seconds if not requiring interaction
      if (!defaultOptions.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 10000);
      }

      // Play sound and vibrate
      if (!defaultOptions.silent) {
        this.playSound();
      }
      if (defaultOptions.vibrate.length > 0) {
        this.vibrate(defaultOptions.vibrate);
      }

      return notification;
    } catch (error) {
      console.error('Error showing native notification:', error);
      return null;
    }
  }

  showToastNotification(title, options = {}) {
    const icon = options.icon || '🔔';
    const duration = options.duration || 5000;

    return toast(title, {
      icon,
      duration,
      position: 'top-center',
      style: {
        background: '#333',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
      ...options.toastOptions
    });
  }

  showNotification(title, options = {}) {
    // Add to queue if processing
    if (this.isProcessingQueue) {
      this.notificationQueue.push({ title, options });
      return;
    }

    // Show native notification if permission granted
    if (this.permission === 'granted' && !options.forceToast) {
      const notification = this.showNativeNotification(title, options);
      if (notification) {
        return notification;
      }
    }

    // Fallback to toast
    return this.showToastNotification(title, options);
  }

  // Specialized notification methods
  showTripNotification(trip, options = {}) {
    const icons = {
      empty: '🟢',
      half: '🟡',
      full: '🔴'
    };

    let icon = icons.empty;
    if (trip.capacity === 14) icon = icons.full;
    else if (trip.capacity >= 7) icon = icons.half;

    const body = trip.capacity === 14 
      ? 'This matatu is FULL' 
      : `${trip.capacity} seats available`;

    return this.showNotification(`${icon} ${trip.route} - ${trip.status}`, {
      body,
      icon: trip.capacity === 14 
        ? '/icons/full.png'
        : trip.capacity >= 7
        ? '/icons/half.png'
        : '/icons/empty.png',
      data: {
        url: `/trip/${trip._id}`,
        tripId: trip._id
      },
      vibrate: trip.capacity === 14 ? [500, 200, 500] : [200, 100, 200],
      ...options
    });
  }

  showAlertNotification(alert, options = {}) {
    const icons = {
      traffic: '🚦',
      police: '👮',
      accident: '🚨',
      road_block: '🚧',
      other: '⚠️'
    };

    const icon = icons[alert.type] || icons.other;

    return this.showNotification(`${icon} ${alert.type.toUpperCase()} ALERT`, {
      body: alert.message,
      icon: '/icons/alert.png',
      data: {
        url: '/alerts',
        alertId: alert._id
      },
      requireInteraction: true,
      vibrate: [500, 200, 500, 200, 500],
      ...options
    });
  }

  showArrivalNotification(trip, minutes, options = {}) {
    return this.showNotification(`🚌 ${trip.route} arriving soon!`, {
      body: `Your matatu will arrive in ${minutes} minutes`,
      icon: '/icons/arrival.png',
      data: {
        url: `/trip/${trip._id}`,
        tripId: trip._id
      },
      vibrate: [300, 100, 300, 100, 300],
      ...options
    });
  }

  showPaymentNotification(payment, options = {}) {
    return this.showNotification('💰 Payment Successful!', {
      body: `KES ${payment.amount} paid for ${payment.description}`,
      icon: '/icons/mpesa.png',
      data: {
        url: '/profile',
        paymentId: payment._id
      },
      ...options
    });
  }

  showReservationNotification(reservation, options = {}) {
    return this.showNotification('✅ Seat Reserved!', {
      body: `Seat ${reservation.seatNumber} reserved on ${reservation.route}`,
      icon: '/icons/reserved.png',
      data: {
        url: `/trip/${reservation.tripId}`,
        reservationId: reservation._id
      },
      ...options
    });
  }

  showDriverNotification(driver, message, options = {}) {
    return this.showNotification(`🚗 ${driver.name || 'Driver'}`, {
      body: message,
      icon: '/icons/driver.png',
      data: {
        url: '/driver',
        driverId: driver._id
      },
      ...options
    });
  }

  showAdminNotification(title, message, options = {}) {
    return this.showNotification(`👨‍💼 ${title}`, {
      body: message,
      icon: '/icons/admin.png',
      data: {
        url: '/admin',
      },
      requireInteraction: true,
      ...options
    });
  }

  // Batch notifications
  processNotificationQueue() {
    if (this.notificationQueue.length === 0 || this.isProcessingQueue) {
      return;
    }

    this.isProcessingQueue = true;

    const processNext = () => {
      if (this.notificationQueue.length === 0) {
        this.isProcessingQueue = false;
        return;
      }

      const { title, options } = this.notificationQueue.shift();
      this.showNotification(title, options);

      // Process next notification after delay
      setTimeout(processNext, 1000);
    };

    processNext();
  }

  // Settings management
  toggleVibration() {
    this.vibrationEnabled = !this.vibrationEnabled;
    this.saveSettings();
    return this.vibrationEnabled;
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    this.saveSettings();
    return this.soundEnabled;
  }

  setVibration(enabled) {
    this.vibrationEnabled = enabled;
    this.saveSettings();
  }

  setSound(enabled) {
    this.soundEnabled = enabled;
    this.saveSettings();
  }

  getSettings() {
    return {
      vibrationEnabled: this.vibrationEnabled,
      soundEnabled: this.soundEnabled,
      permission: this.permission,
      supported: 'Notification' in window
    };
  }

  // Clear all notifications
  clearAll() {
    // This would close all active notifications
    // Note: This only works for notifications we created
    console.log('Clearing all notifications');
  }

  // Schedule notification
  scheduleNotification(title, options, delay) {
    return setTimeout(() => {
      this.showNotification(title, options);
    }, delay);
  }

  // Cancel scheduled notification
  cancelScheduledNotification(timerId) {
    clearTimeout(timerId);
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;