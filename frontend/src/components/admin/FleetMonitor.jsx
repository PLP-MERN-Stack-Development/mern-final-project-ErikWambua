import React, { useState } from 'react';
import { MapPin, Navigation, Clock, Users, Filter, Search } from 'lucide-react';

const FleetMonitor = ({ vehicles }) => {
  const [filter, setFilter] = useState('all'); // all, active, maintenance, inactive
  const [searchQuery, setSearchQuery] = useState('');

  const defaultVehicles = [
    {
      id: 1,
      plate: 'KCA 123A',
      route: '46',
      status: 'active',
      location: 'CBD - Approaching Kencom',
      speed: 45,
      passengers: 10,
      capacity: 14,
      lastUpdate: '2 min ago',
    },
    {
      id: 2,
      plate: 'KCB 456B',
      route: '33',
      status: 'active',
      location: 'Ngong Road - At Prestige',
      speed: 35,
      passengers: 8,
      capacity: 14,
      lastUpdate: '1 min ago',
    },
    {
      id: 3,
      plate: 'KCC 789C',
      route: '11',
      status: 'maintenance',
      location: 'Workshop - Ngara',
      speed: 0,
      passengers: 0,
      capacity: 14,
      lastUpdate: '30 min ago',
    },
    {
      id: 4,
      plate: 'KCD 012D',
      route: '46',
      status: 'inactive',
      location: 'Depot - Westlands',
      speed: 0,
      passengers: 0,
      capacity: 14,
      lastUpdate: '2 hours ago',
    },
  ];

  const fleetData = vehicles || defaultVehicles;

  const filteredVehicles = fleetData.filter(vehicle => {
    const matchesFilter = filter === 'all' || vehicle.status === filter;
    const matchesSearch = searchQuery === '' ||
      vehicle.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.route.includes(searchQuery) ||
      vehicle.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'maintenance':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'inactive':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const activeCount = fleetData.filter(v => v.status === 'active').length;
  const maintenanceCount = fleetData.filter(v => v.status === 'maintenance').length;
  const inactiveCount = fleetData.filter(v => v.status === 'inactive').length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Fleet Monitor</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Real-time vehicle tracking and status
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{activeCount}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
        </div>
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{maintenanceCount}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Maintenance</p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{inactiveCount}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Inactive</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by plate, route, or location..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-nairobi-blue dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'maintenance', 'inactive'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors capitalize ${
                filter === f
                  ? 'bg-nairobi-blue text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicle List */}
      {filteredVehicles.length === 0 ? (
        <div className="text-center py-12">
          <Navigation className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery ? 'No vehicles found' : 'No vehicles in this category'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-nairobi-blue text-white rounded-lg flex items-center justify-center text-sm font-bold">
                    {vehicle.route}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{vehicle.plate}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{vehicle.location}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(vehicle.status)}`}>
                  {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Speed</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{vehicle.speed} km/h</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Passengers</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {vehicle.passengers}/{vehicle.capacity}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Occupancy</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          vehicle.passengers / vehicle.capacity > 0.8
                            ? 'bg-red-500'
                            : vehicle.passengers / vehicle.capacity > 0.5
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${(vehicle.passengers / vehicle.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Last Update</p>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">{vehicle.lastUpdate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FleetMonitor;
