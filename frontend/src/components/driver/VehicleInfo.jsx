import React from 'react';
import { Car, Gauge, Droplet, AlertTriangle, CheckCircle, Wrench } from 'lucide-react';

const VehicleInfo = ({ vehicle }) => {
  const defaultVehicle = {
    plate: 'KCA 123A',
    model: 'Nissan Matatu',
    year: 2020,
    capacity: 14,
    mileage: 125430,
    fuelLevel: 65, // percentage
    lastService: '2024-11-15',
    nextService: '2025-01-15',
    status: 'good', // good, warning, critical
    issues: [],
  };

  const vehicleData = vehicle || defaultVehicle;

  const getFuelColor = (level) => {
    if (level >= 50) return 'bg-green-500';
    if (level >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good':
        return { Icon: CheckCircle, color: 'text-green-600 dark:text-green-400' };
      case 'warning':
        return { Icon: AlertTriangle, color: 'text-yellow-600 dark:text-yellow-400' };
      case 'critical':
        return { Icon: AlertTriangle, color: 'text-red-600 dark:text-red-400' };
      default:
        return { Icon: CheckCircle, color: 'text-gray-600 dark:text-gray-400' };
    }
  };

  const statusInfo = getStatusIcon(vehicleData.status);
  const StatusIcon = statusInfo.Icon;

  const daysSinceService = Math.floor(
    (new Date() - new Date(vehicleData.lastService)) / (1000 * 60 * 60 * 24)
  );
  const daysUntilService = Math.floor(
    (new Date(vehicleData.nextService) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-nairobi-blue text-white rounded-lg flex items-center justify-center">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {vehicleData.plate}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {vehicleData.model} ({vehicleData.year})
            </p>
          </div>
        </div>
        <div className={`${statusInfo.color}`}>
          <StatusIcon className="w-8 h-8" />
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Gauge className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Mileage</span>
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {vehicleData.mileage.toLocaleString()} km
          </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Car className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Capacity</span>
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {vehicleData.capacity} seats
          </p>
        </div>
      </div>

      {/* Fuel Level */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Droplet className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Fuel Level
            </span>
          </div>
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {vehicleData.fuelLevel}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${getFuelColor(
              vehicleData.fuelLevel
            )}`}
            style={{ width: `${vehicleData.fuelLevel}%` }}
          />
        </div>
        {vehicleData.fuelLevel < 25 && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Low fuel - refuel soon
          </p>
        )}
      </div>

      {/* Service Information */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Wrench className="w-5 h-5 text-nairobi-blue dark:text-blue-400" />
          <div className="flex-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">Last Service</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {new Date(vehicleData.lastService).toLocaleDateString()} ({daysSinceService} days
              ago)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <Wrench className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <div className="flex-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">Next Service</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {new Date(vehicleData.nextService).toLocaleDateString()}
              {daysUntilService > 0 ? (
                <span className="text-xs text-gray-500 ml-2">({daysUntilService} days)</span>
              ) : (
                <span className="text-xs text-red-600 ml-2">(Overdue!)</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Issues/Warnings */}
      {vehicleData.issues && vehicleData.issues.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            Active Issues
          </h4>
          <div className="space-y-2">
            {vehicleData.issues.map((issue, index) => (
              <div
                key={index}
                className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-sm text-gray-900 dark:text-white"
              >
                {issue}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status Badge */}
      <div className="mt-6">
        <div
          className={`p-4 rounded-lg text-center ${
            vehicleData.status === 'good'
              ? 'bg-green-50 dark:bg-green-900/20'
              : vehicleData.status === 'warning'
              ? 'bg-yellow-50 dark:bg-yellow-900/20'
              : 'bg-red-50 dark:bg-red-900/20'
          }`}
        >
          <p className={`font-semibold ${statusInfo.color}`}>
            Vehicle Status:{' '}
            {vehicleData.status.charAt(0).toUpperCase() + vehicleData.status.slice(1)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VehicleInfo;
