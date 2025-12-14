import React, { useState } from 'react';
import { Search, MapPin, Navigation, X, Loader } from 'lucide-react';

const RouteSearch = ({ onSearch, onClear }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [searching, setSearching] = useState(false);

  const popularLocations = [
    'CBD',
    'Westlands',
    'Ngong Road',
    'Eastleigh',
    'Thika Road',
    'Kilimani',
    'Karen',
    'Langata',
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!origin.trim() || !destination.trim()) return;

    setSearching(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (onSearch) {
        onSearch({ origin, destination });
      }
    } finally {
      setSearching(false);
    }
  };

  const handleClear = () => {
    setOrigin('');
    setDestination('');
    if (onClear) onClear();
  };

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Find Your Route
      </h3>

      <form onSubmit={handleSearch} className="space-y-4">
        {/* Origin Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            From
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" />
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Enter starting point"
              list="origin-suggestions"
              className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-nairobi-blue dark:bg-gray-700 dark:text-white"
            />
            {origin && (
              <button
                type="button"
                onClick={() => setOrigin('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <datalist id="origin-suggestions">
            {popularLocations.map((loc) => (
              <option key={loc} value={loc} />
            ))}
          </datalist>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSwap}
            className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Navigation className="w-5 h-5 text-gray-600 dark:text-gray-300 transform rotate-90" />
          </button>
        </div>

        {/* Destination Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            To
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-600" />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination"
              list="destination-suggestions"
              className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-nairobi-blue dark:bg-gray-700 dark:text-white"
            />
            {destination && (
              <button
                type="button"
                onClick={() => setDestination('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <datalist id="destination-suggestions">
            {popularLocations.map((loc) => (
              <option key={loc} value={loc} />
            ))}
          </datalist>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!origin.trim() || !destination.trim() || searching}
            className="flex-1 py-3 bg-nairobi-blue text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {searching ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Search Routes
              </>
            )}
          </button>
          {(origin || destination) && (
            <button
              type="button"
              onClick={handleClear}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Popular Routes */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Popular Routes
        </h4>
        <div className="flex flex-wrap gap-2">
          {['CBD → Westlands', 'Eastleigh → CBD', 'Ngong Rd → Town'].map((route) => (
            <button
              key={route}
              onClick={() => {
                const [from, to] = route.split(' → ');
                setOrigin(from);
                setDestination(to);
              }}
              className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-nairobi-blue dark:text-blue-400 rounded-full text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              {route}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RouteSearch;
