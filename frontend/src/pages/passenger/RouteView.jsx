import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, DollarSign, Users, Star, Navigation, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

const RouteView = () => {
  const { routeId } = useParams();
  const navigate = useNavigate();
  const [isAlertEnabled, setIsAlertEnabled] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock route data
  const route = {
    id: routeId,
    number: '46',
    name: 'CBD - Westlands',
    origin: 'Kencom, CBD',
    destination: 'Sarit Centre, Westlands',
    distance: '12.5 km',
    avgFare: 'KES 80',
    avgDuration: '35 min',
    operatingHours: '5:00 AM - 11:00 PM',
    rating: 4.5,
    totalTrips: 1250,
  };

  // Mock active matatus on this route
  const [activeMatatus, setActiveMatatus] = useState([
    { id: 1, plate: 'KCA 123A', eta: '3 min', occupancy: 10, capacity: 14, location: 'Approaching Archives' },
    { id: 2, plate: 'KCB 456B', eta: '8 min', occupancy: 8, capacity: 14, location: 'At Railways' },
    { id: 3, plate: 'KCC 789C', eta: '15 min', occupancy: 12, capacity: 14, location: 'Leaving CBD' },
  ]);

  // Mock stops
  const stops = [
    { id: 1, name: 'Kencom', time: '0 min', fare: 'KES 0' },
    { id: 2, name: 'Archives', time: '5 min', fare: 'KES 20' },
    { id: 3, name: 'Railways', time: '8 min', fare: 'KES 30' },
    { id: 4, name: 'Museum Hill', time: '15 min', fare: 'KES 50' },
    { id: 5, name: 'Westlands', time: '25 min', fare: 'KES 70' },
    { id: 6, name: 'Sarit Centre', time: '35 min', fare: 'KES 80' },
  ];

  const handleToggleAlert = () => {
    setIsAlertEnabled(!isAlertEnabled);
    toast.success(isAlertEnabled ? 'Alert disabled' : 'Alert enabled for this route');
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleTrackMatatu = (matatu) => {
    navigate(`/passenger/track/${matatu.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-nairobi-blue to-blue-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-4 hover:text-blue-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center text-2xl font-bold">
                  {route.number}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{route.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{route.rating} ({route.totalTrips} trips)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleToggleFavorite}
                className={`p-3 rounded-lg transition-colors ${
                  isFavorite ? 'bg-yellow-500 text-white' : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                <Star className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleToggleAlert}
                className={`p-3 rounded-lg transition-colors ${
                  isAlertEnabled ? 'bg-red-500 text-white' : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                <Bell className={`w-5 h-5 ${isAlertEnabled ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Route Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Route Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-nairobi-blue dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Distance</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{route.distance}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-matatu-green dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Duration</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{route.avgDuration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-matatu-yellow dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Fare</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{route.avgFare}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Operating Hours</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{route.operatingHours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Matatus */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Active Matatus</h2>
              <div className="space-y-4">
                {activeMatatus.map((matatu) => (
                  <div key={matatu.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{matatu.plate}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{matatu.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-nairobi-blue dark:text-blue-400">{matatu.eta}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">ETA</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              matatu.occupancy / matatu.capacity > 0.8
                                ? 'bg-red-500'
                                : matatu.occupancy / matatu.capacity > 0.5
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${(matatu.occupancy / matatu.capacity) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {matatu.occupancy}/{matatu.capacity}
                        </span>
                      </div>
                      <button
                        onClick={() => handleTrackMatatu(matatu)}
                        className="ml-4 px-4 py-2 bg-nairobi-blue text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors text-sm"
                      >
                        Track
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Stops */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Route Stops</h2>
              <div className="space-y-4">
                {stops.map((stop, index) => (
                  <div key={stop.id} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-green-500' : index === stops.length - 1 ? 'bg-red-500' : 'bg-blue-500'
                      }`} />
                      {index < stops.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-600" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{stop.name}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{stop.time}</p>
                        <p className="text-sm font-semibold text-nairobi-blue dark:text-blue-400">{stop.fare}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteView;
