import React, { useState } from 'react';
import { MapPin, Navigation, Users, ChevronDown, ChevronUp } from 'lucide-react';

const MapLegend = ({ compact = false }) => {
  const [isExpanded, setIsExpanded] = useState(!compact);

  const legendItems = [
    {
      icon: Navigation,
      color: 'bg-nairobi-blue',
      label: 'Active Vehicles',
      description: 'Matatus currently on route',
    },
    {
      icon: MapPin,
      color: 'bg-blue-600',
      label: 'Major Stages',
      description: 'Main pickup/dropoff points',
    },
    {
      icon: MapPin,
      color: 'bg-gray-600',
      label: 'Regular Stops',
      description: 'Standard pickup points',
    },
    {
      icon: Users,
      color: 'bg-green-500',
      label: 'High Demand',
      description: 'Busy passenger areas',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <h3 className="font-bold text-gray-900 dark:text-white">Map Legend</h3>
        {compact && (
          <div>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        )}
      </button>

      {/* Legend Items */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {legendItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 ${item.color} rounded-full flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Additional Info */}
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-8 h-1 bg-nairobi-blue rounded" />
                <span className="text-gray-600 dark:text-gray-400">Active Route</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-8 h-1 bg-gray-400 rounded" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #9ca3af 0, #9ca3af 4px, transparent 4px, transparent 8px)' }} />
                <span className="text-gray-600 dark:text-gray-400">Planned Route</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <span className="text-gray-600 dark:text-gray-400">Live Updates</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapLegend;
