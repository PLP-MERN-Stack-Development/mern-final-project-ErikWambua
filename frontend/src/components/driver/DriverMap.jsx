import React, { useState } from 'react';
import { MapPin, Navigation, Layers, Maximize2, Minimize2 } from 'lucide-react';

const DriverMap = ({ markers, route, center }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapType, setMapType] = useState('roadmap'); // roadmap, satellite, traffic

  // In a real implementation, this would use Mapbox or Google Maps
  // For now, we'll create a placeholder with visual elements

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50' : 'relative'
      }`}
    >
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-3 bg-white dark:bg-gray-700 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? (
            <Minimize2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          ) : (
            <Maximize2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          )}
        </button>
        <button
          onClick={() =>
            setMapType(
              mapType === 'roadmap'
                ? 'satellite'
                : mapType === 'satellite'
                ? 'traffic'
                : 'roadmap'
            )
          }
          className="p-3 bg-white dark:bg-gray-700 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          title="Change map type"
        >
          <Layers className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* Map Type Indicator */}
      <div className="absolute top-4 left-4 z-10">
        <div className="px-3 py-2 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 capitalize">
            {mapType} View
          </p>
        </div>
      </div>

      {/* Map Placeholder */}
      <div
        className={`relative bg-gradient-to-br from-blue-100 to-green-100 dark:from-gray-700 dark:to-gray-800 ${
          isFullscreen ? 'h-screen' : 'h-96'
        }`}
      >
        {/* Simulated Map Grid */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="gray"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Simulated Route Line */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 100 300 Q 200 200 300 250 T 500 200 T 700 300"
            fill="none"
            stroke="#1E40AF"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="10,5"
            className="animate-dash"
          />
        </svg>

        {/* Current Location Marker */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            {/* Pulsing circle */}
            <div className="absolute w-16 h-16 bg-nairobi-blue rounded-full opacity-20 animate-ping" />
            {/* Main marker */}
            <div className="relative w-12 h-12 bg-nairobi-blue rounded-full flex items-center justify-center shadow-lg border-4 border-white">
              <Navigation className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Destination Marker */}
        <div className="absolute top-1/4 right-1/4">
          <div className="relative">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <div className="px-2 py-1 bg-white dark:bg-gray-700 rounded shadow-md">
                <p className="text-xs font-semibold text-gray-900 dark:text-white">
                  Destination
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pickup Points */}
        <div className="absolute top-2/3 left-1/3">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <span className="text-white text-xs font-bold">1</span>
          </div>
        </div>
        <div className="absolute top-1/3 left-2/3">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <span className="text-white text-xs font-bold">2</span>
          </div>
        </div>
      </div>

      {/* Map Legend */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-nairobi-blue rounded-full" />
            <span className="text-gray-700 dark:text-gray-300">Your Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded-full" />
            <span className="text-gray-700 dark:text-gray-300">Destination</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full" />
            <span className="text-gray-700 dark:text-gray-300">Pickup Points</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-nairobi-blue" />
            <span className="text-gray-700 dark:text-gray-300">Route</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -1000;
          }
        }
        .animate-dash {
          animation: dash 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default DriverMap;
