import React from 'react';
import {
  Navigation,
  MapPin,
  Clock,
  DollarSign,
  User,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';

const TripCard = ({ trip, onClick }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
          label: 'Completed',
        };
      case 'active':
        return {
          icon: Navigation,
          color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
          label: 'In Progress',
        };
      case 'cancelled':
        return {
          icon: XCircle,
          color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
          label: 'Cancelled',
        };
      case 'scheduled':
        return {
          icon: Clock,
          color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
          label: 'Scheduled',
        };
      default:
        return {
          icon: AlertCircle,
          color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
          label: 'Unknown',
        };
    }
  };

  const statusConfig = getStatusConfig(trip.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div
      onClick={() => onClick && onClick(trip)}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all p-5 cursor-pointer border-l-4 border-nairobi-blue"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-nairobi-blue dark:text-blue-400 rounded-full text-xs font-semibold">
              Route {trip.route}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusConfig.color}`}>
              <StatusIcon className="w-3 h-3" />
              {statusConfig.label}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {new Date(trip.date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
        {trip.fare && (
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">Fare</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              KES {trip.fare}
            </p>
          </div>
        )}
      </div>

      {/* Route Info */}
      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-green-600 mt-1" />
          <div className="flex-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">From</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {trip.origin}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="h-8 w-0.5 bg-gray-300 dark:bg-gray-600" />
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-red-600 mt-1" />
          <div className="flex-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">To</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {trip.destination}
            </p>
          </div>
        </div>
      </div>

      {/* Trip Details */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {trip.duration && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {trip.duration}
              </p>
            </div>
          </div>
        )}
        {trip.vehicle && (
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Vehicle</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {trip.vehicle}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Driver Info & Rating */}
      {trip.driver && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-nairobi-blue to-blue-700 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {trip.driver.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {trip.driver}
                </p>
                {trip.driverRating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {trip.driverRating}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {trip.status === 'completed' && !trip.rated && (
              <button className="px-3 py-1 bg-nairobi-blue text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors">
                Rate Trip
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripCard;
