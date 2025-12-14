import React from 'react';
import { Car, MapPin, User, AlertCircle, CheckCircle, Edit, Trash2 } from 'lucide-react';

const VehicleCard = ({ vehicle, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'inactive':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'maintenance':
      case 'inactive':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-nairobi-blue text-white rounded-lg flex items-center justify-center">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">
              {vehicle.plate}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {vehicle.model} - {vehicle.year}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(vehicle)}
              className="p-2 text-gray-400 hover:text-nairobi-blue dark:hover:text-blue-400 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(vehicle)}
              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(vehicle.status)}`}>
          {getStatusIcon(vehicle.status)}
          {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
        </span>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-semibold">
          Route {vehicle.route}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600 dark:text-gray-400">Driver:</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {vehicle.driver || 'Unassigned'}
          </span>
        </div>
        
        {vehicle.location && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">Location:</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {vehicle.location}
            </span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Capacity</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {vehicle.capacity} seats
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Mileage</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {vehicle.mileage?.toLocaleString() || '0'} km
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
