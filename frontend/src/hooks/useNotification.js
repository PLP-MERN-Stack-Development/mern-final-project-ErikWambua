import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const useNotification = () => {
  const [permission, setPermission] = useState('default');
  const [notification, setNotification] = useState(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('Notification' in window);
    
    if (isSupported) {
      setPermission(Notification.permission);
      
      // Listen for permission changes
      if (navigator.permissions) {
        navigator.permissions.query({ name: 'notifications' }).then((permissionStatus) => {
          permissionStatus.onchange = () => {
            setPermission(permissionStatus.state);
          };
        });
      }
    }
  }, [isSupported]);

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      toast.error('Notifications are not supported in your browser');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        toast.success('Notifications enabled!');
        return true;
      } else if (result === 'denied') {
        toast.error('Notifications blocked. Please enable them in browser settings.');
      }
      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Failed to request notification permission');
      return false;
    }
  }, [isSupported]);

  const showNotification = useCallback((title, options = {}) => {
    if (!isSupported || permission !== 'granted') {
      // Fallback to toast
      toast(title, {
        icon: options.icon || '🔔',
        duration: options.duration || 5000,
      });
      return null;
    }

    const defaultOptions = {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      vibrate: [200, 100, 200],
      requireInteraction: false,
      silent: false,
      tag: 'matatu-tracker',
      ...options
    };

    try {
      const notification = new Notification(title, defaultOptions);
      setNotification(notification);

      // Handle click
      notification.onclick = () => {
        window.focus();
        notification.close();
        
        // Navigate if URL is provided
        if (options.data?.url) {
          window.location.href = options.data.url;
        }
      };

      // Handle close
      notification.onclose = () => {
        setNotification(null);
      };

      // Auto close after 10 seconds if not requiring interaction
      if (!defaultOptions.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 10000);
      }

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
      // Fallback to toast
      toast(title, {
        icon: '🔔',
        duration: 5000,
      });
      return null;
    }
  }, [isSupported, permission]);

  const showTripNotification = useCallback((trip) => {
    return showNotification(`🚌 ${trip.route} - ${trip.status}`, {
      body: trip.capacity === 14 
        ? 'This matatu is FULL' 
        : `${trip.capacity} seats available`,
      icon: trip.capacity === 14 
        ? '/icons/full.png'
        : trip.capacity >= 7
        ? '/icons/half.png'
        : '/icons/empty.png',
      data: {
        url: `/trip/${trip._id}`,
        tripId: trip._id
      },
      vibrate: trip.capacity === 14 ? [100, 50, 100] : [200]
    });
  }, [showNotification]);

  const showAlertNotification = useCallback((alert) => {
    const icons = {
      traffic: '🚦',
      police: '👮',
      accident: '🚨',
      road_block: '🚧',
      other: '⚠️'
    };

    return showNotification(`${icons[alert.type]} ${alert.type.toUpperCase()}`, {
      body: alert.message,
      icon: '/icons/alert.png',
      data: {
        url: '/alerts',
        alertId: alert._id
      },
      requireInteraction: true,
      vibrate: [500, 200, 500]
    });
  }, [showNotification]);

  const showArrivalNotification = useCallback((trip, minutes) => {
    return showNotification(`🚌 ${trip.route} arriving soon!`, {
      body: `Your matatu will arrive in ${minutes} minutes`,
      icon: '/icons/arrival.png',
      data: {
        url: `/trip/${trip._id}`,
        tripId: trip._id
      },
      requireInteraction: false,
      vibrate: [300, 100, 300, 100, 300]
    });
  }, [showNotification]);

  const showPaymentNotification = useCallback((payment) => {
    return showNotification('💰 Payment Successful!', {
      body: `KES ${payment.amount} paid for ${payment.description}`,
      icon: '/icons/mpesa.png',
      data: {
        url: '/profile',
        paymentId: payment._id
      },
      requireInteraction: false
    });
  }, [showNotification]);

  const closeNotification = useCallback(() => {
    if (notification) {
      notification.close();
      setNotification(null);
    }
  }, [notification]);

  const scheduleNotification = useCallback((title, options, delay) => {
    return setTimeout(() => {
      showNotification(title, options);
    }, delay);
  }, [showNotification]);

  return {
    permission,
    isSupported,
    requestPermission,
    showNotification,
    showTripNotification,
    showAlertNotification,
    showArrivalNotification,
    showPaymentNotification,
    closeNotification,
    scheduleNotification,
    currentNotification: notification
  };
};

export default useNotification;