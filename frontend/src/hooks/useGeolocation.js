import { useState, useEffect, useCallback } from 'react';

export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watchId, setWatchId] = useState(null);

  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
    ...options
  };

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError(new Error('Geolocation is not supported'));
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp
        });
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
      defaultOptions
    );
  }, [defaultOptions]);

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setError(new Error('Geolocation is not supported'));
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp
        });
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
      defaultOptions
    );

    setWatchId(id);
  }, [defaultOptions]);

  const stopWatching = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  }, [watchId]);

  useEffect(() => {
    getCurrentPosition();
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return {
    location,
    error,
    loading,
    getCurrentPosition,
    startWatching,
    stopWatching,
    isWatching: watchId !== null
  };
};

export default useGeolocation;
