import { useState, useEffect, useCallback } from 'react';
import { useOffline } from '../contexts/OfflineContext';

const useLocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watching, setWatching] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  const { isOffline, addToQueue } = useOffline();

  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
    watch: false,
    updateInterval: 10000, // 10 seconds for watch mode
    saveToQueue: false
  };

  const mergedOptions = { ...defaultOptions, ...options };

  const getCurrentPosition = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy, speed, heading, altitude } = position.coords;
          const locationData = {
            lat: latitude,
            lng: longitude,
            accuracy,
            speed: speed || 0,
            heading: heading || 0,
            altitude: altitude || 0,
            timestamp: position.timestamp
          };
          resolve(locationData);
        },
        (error) => {
          let errorMessage;
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timeout';
              break;
            default:
              errorMessage = 'Unknown location error';
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: mergedOptions.enableHighAccuracy,
          timeout: mergedOptions.timeout,
          maximumAge: mergedOptions.maximumAge
        }
      );
    });
  }, [mergedOptions]);

  const startWatching = useCallback(() => {
    if (!navigator.geolocation || watching) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy, speed, heading } = position.coords;
        const newLocation = {
          lat: latitude,
          lng: longitude,
          accuracy,
          speed: speed || 0,
          heading: heading || 0,
          timestamp: position.timestamp
        };
        
        setLocation(newLocation);
        setLastUpdate(new Date());
        setError(null);

        // Save to offline queue if enabled and offline
        if (mergedOptions.saveToQueue && isOffline) {
          addToQueue('location-update', newLocation);
        }
      },
      (error) => {
        let errorMessage;
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
            case error.TIMEOUT:
              errorMessage = 'Location request timeout';
              break;
            default:
              errorMessage = 'Unknown location error';
          }
          setError(new Error(errorMessage));
        }
    );

    setWatching(true);
    return () => {
      navigator.geolocation.clearWatch(watchId);
      setWatching(false);
    };
  }, [mergedOptions.saveToQueue, isOffline, addToQueue, watching]);

  const stopWatching = useCallback(() => {
    setWatching(false);
  }, []);

  const requestPermission = useCallback(async () => {
    if (!navigator.permissions) {
      return 'prompt';
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      return permission.state;
    } catch (error) {
      console.error('Error checking permission:', error);
      return 'prompt';
    }
  }, []);

  const getDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  }, []);

  const getBearing = useCallback((lat1, lon1, lat2, lon2) => {
    const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
    const θ = Math.atan2(y, x);
    const bearing = (θ * 180 / Math.PI + 360) % 360;
    return bearing;
  }, []);

  const isWithinRadius = useCallback((centerLat, centerLon, radiusKm) => {
    if (!location) return false;
    const distance = getDistance(centerLat, centerLon, location.lat, location.lng);
    return distance <= radiusKm;
  }, [location, getDistance]);

  // Initial location fetch
  useEffect(() => {
    let mounted = true;

    const fetchLocation = async () => {
      try {
        const position = await getCurrentPosition();
        if (mounted) {
          setLocation(position);
          setLastUpdate(new Date());
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchLocation();

    return () => {
      mounted = false;
    };
  }, [getCurrentPosition]);

  // Auto-watch if enabled
  useEffect(() => {
    let cleanup;
    
    if (mergedOptions.watch && !watching) {
      cleanup = startWatching();
    }

    return () => {
      if (cleanup) cleanup();
    };
  }, [mergedOptions.watch, startWatching, watching]);

  return {
    location,
    error,
    loading,
    watching,
    lastUpdate,
    getCurrentPosition,
    startWatching,
    stopWatching,
    requestPermission,
    getDistance,
    getBearing,
    isWithinRadius,
    refresh: getCurrentPosition
  };
};

export default useLocation;