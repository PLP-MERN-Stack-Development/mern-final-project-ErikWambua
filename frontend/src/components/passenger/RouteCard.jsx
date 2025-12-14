import React from 'react';
import { MapPin, Clock, DollarSign, Users, Navigation, Heart, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const RouteCard = ({ route, onSelect, onFavorite, isFavorite = false }) => {
  const defaultRoute = {
    id: '46',
    name: 'Route 46',
    origin: 'CBD',
    destination: 'Westlands',
    fare: 100,
    duration: '25 min',
    distance: '12 km',
    activeVehicles: 8,
    nextArrival: '5 min',
    frequency: 'Every 10 min',
    rating: 4.5,
    reviews: 234,
    operatingHours: '5:00 AM - 11:00 PM',
  };

  const routeData = route || defaultRoute;

  const handleFavorite = (e) => {
    e.stopPropagation();
    if (onFavorite) onFavorite(routeData);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  return (
    <div
      onClick={() => onSelect && onSelect(routeData)}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all p-5 cursor-pointer border-2 border-transparent hover:border-nairobi-blue"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-nairobi-blue to-blue-700 text-white rounded-lg flex items-center justify-center font-bold text-lg">
            {routeData.id}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">
              {routeData.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {routeData.rating} ({routeData.reviews})
                </span>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={handleFavorite}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite
                ? 'fill-red-500 text-red-500'
                : 'text-gray-400 hover:text-red-500'
            }`}
          />
        </button>
      </div>

      {/* Route Info */}
      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">From</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {routeData.origin}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Navigation className="w-4 h-4 text-gray-400 transform rotate-90" />
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-red-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">To</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {routeData.destination}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Fare</span>
          </div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            KES {routeData.fare}
          </p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Duration</span>
          </div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {routeData.duration}
          </p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Navigation className="w-4 h-4 text-purple-600" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Distance</span>
          </div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {routeData.distance}
          </p>
        </div>
      </div>

      {/* Availability */}
      <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-nairobi-blue dark:text-blue-400" />
          <span className="text-sm text-gray-900 dark:text-white">
            <span className="font-bold">{routeData.activeVehicles}</span> vehicles active
          </span>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400">Next arrival</p>
          <p className="text-sm font-bold text-nairobi-blue dark:text-blue-400">
            {routeData.nextArrival}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RouteCard;
