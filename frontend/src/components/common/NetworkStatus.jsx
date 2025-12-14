import React from 'react';
import { useNetwork } from '../../hooks/useNetwork';
import { Wifi, WifiOff, Signal } from 'lucide-react';

const NetworkStatus = ({ showDetails = false }) => {
  const { online, effectiveType, downlink, rtt, saveData } = useNetwork();

  if (!showDetails) {
    return (
      <div className="flex items-center space-x-2">
        {online ? (
          <Wifi className="w-4 h-4 text-green-500" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-500" />
        )}
      </div>
    );
  }

  const getConnectionQuality = () => {
    if (!online) return 'offline';
    if (effectiveType === '4g') return 'excellent';
    if (effectiveType === '3g') return 'good';
    if (effectiveType === '2g') return 'poor';
    if (effectiveType === 'slow-2g') return 'very-poor';
    return 'unknown';
  };

  const quality = getConnectionQuality();
  const qualityColors = {
    excellent: 'text-green-500',
    good: 'text-blue-500',
    poor: 'text-yellow-500',
    'very-poor': 'text-red-500',
    offline: 'text-gray-500',
    unknown: 'text-gray-400'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Network Status
        </h3>
        {online ? (
          <Wifi className={`w-5 h-5 ${qualityColors[quality]}`} />
        ) : (
          <WifiOff className="w-5 h-5 text-red-500" />
        )}
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Status:</span>
          <span className={`font-medium ${online ? 'text-green-600' : 'text-red-600'}`}>
            {online ? 'Online' : 'Offline'}
          </span>
        </div>

        {online && (
          <>
            {effectiveType && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Type:</span>
                <span className={`font-medium ${qualityColors[quality]}`}>
                  {effectiveType.toUpperCase()}
                </span>
              </div>
            )}

            {downlink !== null && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Speed:</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {downlink} Mbps
                </span>
              </div>
            )}

            {rtt !== null && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Latency:</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {rtt} ms
                </span>
              </div>
            )}

            {saveData && (
              <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                <p className="text-xs text-yellow-700 dark:text-yellow-400">
                  Data Saver Mode Active
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NetworkStatus;
