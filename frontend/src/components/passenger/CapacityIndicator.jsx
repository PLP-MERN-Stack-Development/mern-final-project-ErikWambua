import React from 'react';
import { Users, AlertTriangle } from 'lucide-react';

const CapacityIndicator = ({ current = 0, total = 14, showWarning = true }) => {
  const percentage = (current / total) * 100;
  const available = total - current;

  const getCapacityStatus = () => {
    if (percentage >= 100) return { label: 'Full', color: 'red', bgColor: 'bg-red-500' };
    if (percentage >= 90)
      return { label: 'Almost Full', color: 'orange', bgColor: 'bg-orange-500' };
    if (percentage >= 70)
      return { label: 'Filling Up', color: 'yellow', bgColor: 'bg-yellow-500' };
    return { label: 'Available', color: 'green', bgColor: 'bg-green-500' };
  };

  const status = getCapacityStatus();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="font-bold text-gray-900 dark:text-white">Capacity</h3>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            status.color === 'red'
              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              : status.color === 'orange'
              ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
              : status.color === 'yellow'
              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          }`}
        >
          {status.label}
        </span>
      </div>

      {/* Current/Total Display */}
      <div className="text-center mb-4">
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-4xl font-bold text-gray-900 dark:text-white">{current}</span>
          <span className="text-2xl text-gray-400 dark:text-gray-600">/</span>
          <span className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
            {total}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {available} {available === 1 ? 'seat' : 'seats'} available
        </p>
      </div>

      {/* Visual Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
          <div
            className={`h-4 ${status.bgColor} transition-all duration-500 flex items-center justify-end pr-2`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          >
            {percentage > 20 && (
              <span className="text-white text-xs font-bold">{Math.round(percentage)}%</span>
            )}
          </div>
        </div>
      </div>

      {/* Seat Grid Visualization */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`aspect-square rounded ${
              i < current
                ? 'bg-nairobi-blue dark:bg-blue-600'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
            title={i < current ? 'Occupied' : 'Available'}
          />
        ))}
      </div>

      {/* Warning */}
      {showWarning && percentage >= 90 && percentage < 100 && (
        <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          <p className="text-xs text-orange-700 dark:text-orange-400 font-semibold">
            Vehicle is almost full. Book now to secure your seat!
          </p>
        </div>
      )}

      {percentage >= 100 && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
          <p className="text-xs text-red-700 dark:text-red-400 font-semibold">
            Vehicle is full. Please wait for the next one.
          </p>
        </div>
      )}
    </div>
  );
};

export default CapacityIndicator;
