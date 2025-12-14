import { useState, useEffect } from 'react';

export const useNetwork = () => {
  const [networkState, setNetworkState] = useState({
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
    effectiveType: null,
    downlink: null,
    rtt: null,
    saveData: false
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateNetworkState = () => {
      const connection = navigator.connection || 
                        navigator.mozConnection || 
                        navigator.webkitConnection;

      setNetworkState({
        online: navigator.onLine,
        effectiveType: connection?.effectiveType || null,
        downlink: connection?.downlink || null,
        rtt: connection?.rtt || null,
        saveData: connection?.saveData || false
      });
    };

    const handleOnline = () => {
      updateNetworkState();
    };

    const handleOffline = () => {
      setNetworkState(prev => ({ ...prev, online: false }));
    };

    const handleConnectionChange = () => {
      updateNetworkState();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const connection = navigator.connection || 
                      navigator.mozConnection || 
                      navigator.webkitConnection;

    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
    }

    // Initial update
    updateNetworkState();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);

  return networkState;
};

export default useNetwork;
