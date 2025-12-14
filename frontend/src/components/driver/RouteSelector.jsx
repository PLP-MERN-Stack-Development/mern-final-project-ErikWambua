import React, { useState } from 'react';
import { MapPin, TrendingUp, Clock, Navigation, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const RouteSelector = ({ onRouteSelect, currentRoute }) => {
  const [selectedRoute, setSelectedRoute] = useState(currentRoute || null);
  const [loading, setLoading] = useState(false);

  const routes = [
    {
      id: '46',
      name: 'Route 46',
      from: 'CBD',
      to: 'Westlands',
      distance: '12 km',
      avgFare: 100,
      avgTime: '25 min',
      demand: 'high',
      passengers: '~500/day',
    },
    {
      id: '33',
      name: 'Route 33',
      from: 'Ngong Road',
      to: 'City Center',
      distance: '8 km',
      avgFare: 80,
      avgTime: '18 min',
      demand: 'medium',
      passengers: '~350/day',
    },
    {
      id: '11',
      name: 'Route 11',
      from: 'Eastleigh',
      to: 'CBD',
      distance: '10 km',
      avgFare: 90,
      avgTime: '22 min',
      demand: 'high',
      passengers: '~450/day',
    },
    {
      id: '34',
      name: 'Route 34',
      from: 'Thika Road',
      to: 'Town',
      distance: '15 km',
      avgFare: 120,
      avgTime: '30 min',
      demand: 'medium',
      passengers: '~300/day',
    },
  ];

  const handleSelectRoute = async (route) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSelectedRoute(route.id);
      toast.success(`Selected ${route.name}`);
      if (onRouteSelect) onRouteSelect(route);
    } catch (error) {
      toast.error('Failed to select route');
    } finally {
      setLoading(false);
    }
  };

  const getDemandColor = (demand) => {
    switch (demand) {
      case 'high':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Select Your Route
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Choose the route you'll be operating on today
        </p>
      </div>

      {/* Routes List */}
      <div className="space-y-3">
        {routes.map((route) => {
          const isSelected = selectedRoute === route.id;

          return (
            <div
              key={route.id}
              onClick={() => !loading && handleSelectRoute(route)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-nairobi-blue bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-nairobi-blue text-white rounded-lg flex items-center justify-center font-bold">
                    {route.id}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{route.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {route.from} → {route.to}
                      </span>
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-8 h-8 bg-nairobi-blue text-white rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Route Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Distance</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {route.distance}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Avg Time</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {route.avgTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Avg Fare</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      KES {route.avgFare}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Demand</p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${getDemandColor(
                      route.demand
                    )}`}
                  >
                    {route.demand.charAt(0).toUpperCase() + route.demand.slice(1)}
                  </span>
                </div>
              </div>

              {/* Daily Passengers */}
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Daily Passengers: <span className="font-semibold">{route.passengers}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Route Info */}
      {selectedRoute && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-gray-900 dark:text-white">
            <span className="font-semibold">Current Route:</span> Route {selectedRoute}
          </p>
        </div>
      )}
    </div>
  );
};

export default RouteSelector;
