import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Star, Search, Navigation, Bell, Route as RouteIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'matpulse_notifications';

const PassengerHome = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock nearby matatus
  const [nearbyMatatus, setNearbyMatatus] = useState([
    { id: 1, route: '46', plate: 'KCA 123A', distance: '0.5 km', eta: '3 min', occupancy: 10, capacity: 14 },
    { id: 2, route: '33', plate: 'KCB 456B', distance: '1.2 km', eta: '7 min', occupancy: 8, capacity: 14 },
    { id: 3, route: '11', plate: 'KCC 789C', distance: '2.0 km', eta: '12 min', occupancy: 12, capacity: 14 },
  ]);

  // Mock favorite routes
  const favoriteRoutes = [
    { id: 1, name: 'Route 46', from: 'CBD', to: 'Westlands', icon: '🚐' },
    { id: 2, name: 'Route 33', from: 'Ngong Road', to: 'CBD', icon: '🚐' },
  ];

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to get your location');
        }
      );
    }

    // Get unread notifications count
    const updateUnreadCount = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const notifications = JSON.parse(stored);
        const count = notifications.filter(n => !n.read).length;
        setUnreadCount(count);
      }
    };

    updateUnreadCount();

    // Listen for storage changes (when notifications are updated)
    window.addEventListener('storage', updateUnreadCount);
    return () => window.removeEventListener('storage', updateUnreadCount);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/passenger/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleTrackMatatu = (matatu) => {
    navigate(`/passenger/track/${matatu.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-nairobi-blue to-blue-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Welcome Back! 👋</h1>
              <p className="text-blue-100 mt-1">Find your next ride</p>
            </div>
            <button
              onClick={() => navigate('/passenger/notifications')}
              className="relative p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 rounded-full text-xs flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search routes, destinations..."
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-matatu-yellow"
            />
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <button
            onClick={() => navigate('/passenger/routes')}
            className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <RouteIcon className="w-6 h-6 text-nairobi-blue dark:text-blue-400" />
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">All Routes</span>
          </button>

          <button
            onClick={() => navigate('/favorites')}
            className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-matatu-yellow dark:text-yellow-400" />
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Favorites</span>
          </button>

          <button
            onClick={() => navigate('/passenger/history')}
            className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-matatu-green dark:text-green-400" />
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">History</span>
          </button>

          <button
            onClick={() => navigate('/alerts')}
            className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <Bell className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Alerts</span>
          </button>
        </div>

        {/* Favorite Routes */}
        {favoriteRoutes.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Favorite Routes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favoriteRoutes.map((route) => (
                <button
                  key={route.id}
                  onClick={() => navigate(`/route/${route.id}`)}
                  className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
                >
                  <div className="text-4xl">{route.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white">{route.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {route.from} → {route.to}
                    </p>
                  </div>
                  <Navigation className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Nearby Matatus */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Nearby Matatus</h2>
            <button
              onClick={() => window.location.reload()}
              className="text-nairobi-blue dark:text-blue-400 font-semibold hover:underline"
            >
              Refresh
            </button>
          </div>

          <div className="space-y-4">
            {nearbyMatatus.map((matatu) => (
              <div
                key={matatu.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-nairobi-blue text-white rounded-lg flex items-center justify-center text-xl font-bold">
                      {matatu.route}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{matatu.plate}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Route {matatu.route}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-nairobi-blue dark:text-blue-400">{matatu.eta}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{matatu.distance} away</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
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
                    className="px-4 py-2 bg-nairobi-blue text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors text-sm"
                  >
                    Track
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerHome;
