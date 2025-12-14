import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation, DollarSign, Clock, Users, TrendingUp, MapPin, Star, Play, Pause } from 'lucide-react';
import toast from 'react-hot-toast';

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(false);
  const [activeTrip, setActiveTrip] = useState(null);

  // Mock driver stats
  const stats = {
    todayEarnings: 2500,
    todayTrips: 12,
    rating: 4.8,
    totalPassengers: 156,
    weeklyEarnings: 15400,
    monthlyEarnings: 58900,
  };

  // Mock pending trips
  const [pendingTrips] = useState([
    {
      id: 1,
      passenger: 'Jane Doe',
      pickup: 'Kencom Bus Stop',
      dropoff: 'Westlands',
      fare: 80,
      distance: '12.5 km',
      requestedAt: '2 min ago',
    },
    {
      id: 2,
      passenger: 'John Smith',
      pickup: 'Railways Station',
      dropoff: 'CBD',
      fare: 50,
      distance: '5.2 km',
      requestedAt: '5 min ago',
    },
  ]);

  // Mock recent trips
  const recentTrips = [
    { id: 1, route: 'CBD - Westlands', fare: 80, time: '08:30 AM', status: 'completed' },
    { id: 2, route: 'Ngong Road - CBD', fare: 50, time: '09:15 AM', status: 'completed' },
    { id: 3, route: 'Thika Road - CBD', fare: 100, time: '10:00 AM', status: 'completed' },
  ];

  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
    toast.success(isOnline ? 'You are now offline' : 'You are now online');
  };

  const handleAcceptTrip = (trip) => {
    setActiveTrip(trip);
    toast.success('Trip accepted!');
    navigate('/driver/active-trip');
  };

  const handleDeclineTrip = (tripId) => {
    toast.success('Trip declined');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-nairobi-blue to-blue-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Driver Dashboard</h1>
              <p className="text-blue-100 mt-1">Manage your trips and earnings</p>
            </div>
            
            {/* Online/Offline Toggle */}
            <button
              onClick={handleToggleOnline}
              className={`flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all shadow-lg ${
                isOnline
                  ? 'bg-matatu-green hover:bg-green-700'
                  : 'bg-gray-500 hover:bg-gray-600'
              }`}
            >
              {isOnline ? (
                <>
                  <Pause className="w-5 h-5" />
                  Go Offline
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Go Online
                </>
              )}
            </button>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-sm font-medium">
              {isOnline ? 'Available for trips' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Today's Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-matatu-green" />
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">KES {stats.todayEarnings}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Today&apos;s Earnings</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Navigation className="w-8 h-8 text-nairobi-blue" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.todayTrips}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Today&apos;s Trips</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-8 h-8 text-matatu-yellow fill-matatu-yellow" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.rating}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPassengers}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Passengers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Trip Requests */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Pending Requests
                {pendingTrips.length > 0 && (
                  <span className="ml-2 px-3 py-1 bg-red-500 text-white text-sm rounded-full">
                    {pendingTrips.length}
                  </span>
                )}
              </h2>

              {!isOnline ? (
                <div className="text-center py-12">
                  <Pause className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    You are currently offline
                  </p>
                  <button
                    onClick={handleToggleOnline}
                    className="px-6 py-3 bg-nairobi-blue text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors"
                  >
                    Go Online to Receive Requests
                  </button>
                </div>
              ) : pendingTrips.length === 0 ? (
                <div className="text-center py-12">
                  <Navigation className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No pending requests
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Waiting for passengers...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingTrips.map((trip) => (
                    <div key={trip.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-l-4 border-nairobi-blue">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">{trip.passenger}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{trip.requestedAt}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-matatu-green">KES {trip.fare}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{trip.distance}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Pickup</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{trip.pickup}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Dropoff</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{trip.dropoff}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAcceptTrip(trip)}
                          className="flex-1 py-2 bg-matatu-green text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleDeclineTrip(trip.id)}
                          className="flex-1 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats & Recent Trips */}
          <div className="space-y-6">
            {/* Earnings Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Earnings</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">This Week</span>
                  <span className="font-bold text-gray-900 dark:text-white">KES {stats.weeklyEarnings.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">This Month</span>
                  <span className="font-bold text-gray-900 dark:text-white">KES {stats.monthlyEarnings.toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/driver/earnings')}
                className="w-full mt-4 py-2 bg-nairobi-blue text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors"
              >
                View Details
              </button>
            </div>

            {/* Recent Trips */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Trips</h2>
              <div className="space-y-3">
                {recentTrips.map((trip) => (
                  <div key={trip.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{trip.route}</p>
                      <span className="text-sm font-bold text-matatu-green">KES {trip.fare}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{trip.time}</p>
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

export default DriverDashboard;
