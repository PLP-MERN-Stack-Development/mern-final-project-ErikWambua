import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Search, Navigation2, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const Routes = () => {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/passenger/routes');
      setRoutes(response.data.data || []);
    } catch (error) {
      console.error('Error fetching routes:', error);
      toast.error('Failed to load routes');
    } finally {
      setLoading(false);
    }
  };

  const filteredRoutes = routes.filter(route => {
    const query = searchQuery.toLowerCase();
    return (
      route.name?.toLowerCase().includes(query) ||
      route.nickname?.toLowerCase().includes(query) ||
      route.origin?.name?.toLowerCase().includes(query) ||
      route.destination?.name?.toLowerCase().includes(query)
    );
  });

  const handleRouteClick = (routeId) => {
    navigate(`/route/${routeId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-nairobi-blue to-blue-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">All Routes</h1>
          <p className="text-blue-100">Discover matatu routes across Nairobi</p>
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
              placeholder="Search routes by name, origin, or destination..."
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-nairobi-blue focus:border-transparent"
            />
          </div>
        </div>

        {/* Routes List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nairobi-blue"></div>
          </div>
        ) : filteredRoutes.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No routes found' : 'No routes available'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery ? 'Try a different search term' : 'Routes will appear here once added'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRoutes.map((route) => (
              <div
                key={route._id}
                onClick={() => handleRouteClick(route._id)}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer border border-gray-200 dark:border-gray-700 overflow-hidden group"
              >
                {/* Route Header */}
                <div className="bg-gradient-to-r from-nairobi-blue to-blue-900 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{route.nickname || route.name}</h3>
                    <Navigation2 className="w-5 h-5 text-matatu-yellow" />
                  </div>
                  <p className="text-xs text-blue-100">{route.name}</p>
                </div>

                {/* Route Details */}
                <div className="p-4 space-y-3">
                  {/* Origin to Destination */}
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-600"></div>
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {route.origin?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Origin</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {route.destination?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Destination</p>
                      </div>
                    </div>
                  </div>

                  {/* Route Info */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {route.estimatedDuration} min
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          KSh {route.fareStructure?.baseFare || 0}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Base Fare</p>
                      </div>
                    </div>
                  </div>

                  {/* Stages Count */}
                  {route.stages && route.stages.length > 0 && (
                    <div className="pt-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {route.stages.length} stages along this route
                      </p>
                    </div>
                  )}

                  {/* View Details Button */}
                  <button className="w-full mt-2 py-2 bg-nairobi-blue text-white rounded-lg hover:bg-blue-800 transition-colors group-hover:bg-blue-800">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Routes;
