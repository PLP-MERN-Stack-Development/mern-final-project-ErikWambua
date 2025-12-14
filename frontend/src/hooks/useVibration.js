import { useState, useCallback } from 'react';

export const useVibration = () => {
  const [isSupported] = useState(() => {
    return typeof navigator !== 'undefined' && 'vibrate' in navigator;
  });

  const vibrate = useCallback((pattern) => {
    if (!isSupported) {
      console.warn('Vibration API is not supported');
      return false;
    }

    try {
      return navigator.vibrate(pattern);
    } catch (error) {
      console.error('Vibration error:', error);
      return false;
    }
  }, [isSupported]);

  const vibrateShort = useCallback(() => {
    return vibrate(100);
  }, [vibrate]);

  const vibrateLong = useCallback(() => {
    return vibrate(500);
  }, [vibrate]);

  const vibratePattern = useCallback((pattern = [100, 200, 100]) => {
    return vibrate(pattern);
  }, [vibrate]);

  const stop = useCallback(() => {
    return vibrate(0);
  }, [vibrate]);

  return {
    isSupported,
    vibrate,
    vibrateShort,
    vibrateLong,
    vibratePattern,
    stop
  };
};

export default useVibration;
