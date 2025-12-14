import { useState, useEffect } from 'react';

export const useOrientation = () => {
  const [orientation, setOrientation] = useState({
    alpha: 0, // 0-360 degrees
    beta: 0,  // -180 to 180 degrees
    gamma: 0, // -90 to 90 degrees
    absolute: false
  });
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if DeviceOrientationEvent is supported
    if ('DeviceOrientationEvent' in window) {
      setIsSupported(true);

      const handleOrientation = (event) => {
        setOrientation({
          alpha: event.alpha || 0,
          beta: event.beta || 0,
          gamma: event.gamma || 0,
          absolute: event.absolute || false
        });
      };

      window.addEventListener('deviceorientation', handleOrientation);

      return () => {
        window.removeEventListener('deviceorientation', handleOrientation);
      };
    } else {
      setIsSupported(false);
    }
  }, []);

  // Request permission for iOS 13+
  const requestPermission = async () => {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error('Error requesting orientation permission:', error);
        return false;
      }
    }
    return true; // Permission not required
  };

  return {
    orientation,
    isSupported,
    requestPermission
  };
};

export default useOrientation;
