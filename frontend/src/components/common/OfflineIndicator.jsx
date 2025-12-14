import React from 'react';
import { useOffline } from '../../contexts/OfflineContext';
import { WifiOff, Wifi } from 'lucide-react';

const OfflineIndicator = () => {
  const { isOffline } = useOffline();

  // Don't show indicator when online
  if (!isOffline) {
    return null;
  }

  return (
    <div
      className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-lg transition-all duration-300 bg-red-500 text-white"
    >
      <div className="flex items-center space-x-2">
        <WifiOff className="w-4 h-4 animate-pulse" />
        <span className="text-sm font-medium">No Internet Connection</span>
      </div>
    </div>
  );
};

export default OfflineIndicator;
