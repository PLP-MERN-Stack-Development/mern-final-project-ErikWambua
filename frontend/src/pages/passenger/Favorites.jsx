import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, DollarSign, Trash2, Navigation, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const Favorites = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      routeNumber: '46',
      name: 'Route 46',
      from: 'CBD - Kencom',
      to: 'Westlands - Sarit',
      distance: '12.5 km',
      avgFare: 'KES 80',
      avgDuration: '35 min',
      frequency: '15 trips',
      lastUsed: '2 days ago',
    },
    {
      id: 2,
      routeNumber: '33',
      name: 'Route 33',
      from: 'Ngong Road',
      to: 'CBD',
      distance: '8.2 km',
      avgFare: 'KES 50',
      avgDuration: '25 min',
      frequency: '23 trips',
      lastUsed: '1 week ago',
    },
    {
      id: 3,
      routeNumber: '11',
      name: 'Route 11',
      from: 'Thika Road',
      to: 'CBD',
      distance: '15.8 km',
      avgFare: 'KES 100',
      avgDuration: '45 min',
      frequency: '8 trips',
      lastUsed: '3 days ago',
    },
  ]);

  const handleRemoveFavorite = (id) => {
    setFavorites(favorites.filter(fav => fav.id !== id));
    toast.success('Removed from favorites');
  };

  const handleViewRoute = (id) => {
    navigate(`/passenger/route/${id}`);
  };

  const filteredFavorites = favorites.filter(fav =>
    fav.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fav.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fav.to.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-nairobi-blue to-blue-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Favorite Routes</h1>
          <p className="text-blue-100">Your most frequently used routes</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search favorites..."
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-nairobi-blue dark:text-white"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-nairobi-blue dark:text-blue-400">{favorites.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Favorite Routes</p>
              </div>
              <Star className="w-10 h-10 text-matatu-yellow fill-matatu-yellow" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-matatu-green dark:text-green-400">
                  {favorites.reduce((sum, fav) => sum + parseInt(fav.frequency), 0)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Trips</p>
              </div>
              <Navigation className="w-10 h-10 text-matatu-green" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.round(favorites.reduce((sum, fav) => sum + parseFloat(fav.distance), 0))} km
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Distance</p>
              </div>
              <MapPin className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        {/* Favorites List */}
        {filteredFavorites.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <Star className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No routes found' : 'No favorites yet'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery
                ? 'Try a different search term'
                : 'Start adding your frequently used routes to favorites'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate('/passenger/routes')}
                className="px-6 py-3 bg-nairobi-blue text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors"
              >
                Browse Routes
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFavorites.map((favorite) => (
              <div
                key={favorite.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                {/* Route Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-nairobi-blue text-white rounded-lg flex items-center justify-center text-xl font-bold">
                      {favorite.routeNumber}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{favorite.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Last: {favorite.lastUsed}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFavorite(favorite.id)}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Route Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">From</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{favorite.from}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">To</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{favorite.to}</p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <MapPin className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">{favorite.distance}</p>
                  </div>
                  <div className="text-center">
                    <Clock className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">{favorite.avgDuration}</p>
                  </div>
                  <div className="text-center">
                    <DollarSign className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">{favorite.avgFare}</p>
                  </div>
                </div>

                {/* Frequency Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-matatu-green" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{favorite.frequency}</span>
                  </div>
                  <Star className="w-5 h-5 text-matatu-yellow fill-matatu-yellow" />
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleViewRoute(favorite.id)}
                  className="w-full py-2 bg-nairobi-blue text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors"
                >
                  View Route
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
