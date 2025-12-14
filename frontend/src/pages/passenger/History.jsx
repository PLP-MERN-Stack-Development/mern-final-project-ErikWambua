import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, Clock, Filter, Download, Search, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const History = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // all, completed, cancelled
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('all'); // all, today, week, month

  const [trips] = useState([
    {
      id: 1,
      date: '2024-01-15',
      time: '08:30 AM',
      route: 'Route 46',
      routeNumber: '46',
      from: 'Kencom, CBD',
      to: 'Sarit Centre, Westlands',
      fare: 80,
      status: 'completed',
      plate: 'KCA 123A',
    },
    {
      id: 2,
      date: '2024-01-14',
      time: '06:15 PM',
      route: 'Route 33',
      routeNumber: '33',
      from: 'Ngong Road',
      to: 'CBD',
      fare: 50,
      status: 'completed',
      plate: 'KCB 456B',
    },
    {
      id: 3,
      date: '2024-01-13',
      time: '09:00 AM',
      route: 'Route 11',
      routeNumber: '11',
      from: 'Thika Road',
      to: 'CBD',
      fare: 100,
      status: 'cancelled',
      plate: 'KCC 789C',
    },
    {
      id: 4,
      date: '2024-01-12',
      time: '05:30 PM',
      route: 'Route 46',
      routeNumber: '46',
      from: 'CBD',
      to: 'Westlands',
      fare: 80,
      status: 'completed',
      plate: 'KCD 012D',
    },
  ]);

  const handleExport = () => {
    toast.success('Exporting trip history...');
  };

  const handleViewTrip = (tripId) => {
    navigate(`/passenger/trip/${tripId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const filteredTrips = trips.filter(trip => {
    const matchesStatus = filter === 'all' || trip.status === filter;
    const matchesSearch = searchQuery === '' || 
      trip.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.to.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalSpent = trips
    .filter(trip => trip.status === 'completed')
    .reduce((sum, trip) => sum + trip.fare, 0);

  const completedTrips = trips.filter(trip => trip.status === 'completed').length;
  const cancelledTrips = trips.filter(trip => trip.status === 'cancelled').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-nairobi-blue to-blue-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Trip History</h1>
          <p className="text-blue-100">View and manage your past trips</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-nairobi-blue dark:text-blue-400">{trips.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Trips</p>
              </div>
              <MapPin className="w-10 h-10 text-nairobi-blue dark:text-blue-400" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-matatu-green dark:text-green-400">{completedTrips}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Completed</p>
              </div>
              <Clock className="w-10 h-10 text-matatu-green dark:text-green-400" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{cancelledTrips}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Cancelled</p>
              </div>
              <Calendar className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-matatu-yellow dark:text-yellow-400">KES {totalSpent}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Spent</p>
              </div>
              <DollarSign className="w-10 h-10 text-matatu-yellow dark:text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trips..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-nairobi-blue dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'all'
                    ? 'bg-nairobi-blue text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'completed'
                    ? 'bg-nairobi-blue text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter('cancelled')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'cancelled'
                    ? 'bg-nairobi-blue text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Cancelled
              </button>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Trip List */}
        {filteredTrips.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No trips found' : 'No trip history'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery ? 'Try a different search term' : 'Your completed trips will appear here'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTrips.map((trip) => (
              <div
                key={trip.id}
                onClick={() => handleViewTrip(trip.id)}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-nairobi-blue text-white rounded-lg flex items-center justify-center text-xl font-bold">
                      {trip.routeNumber}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{trip.route}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {trip.date} at {trip.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(trip.status)}`}>
                      {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">From</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{trip.from}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">To</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{trip.to}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Fare</p>
                      <p className="text-lg font-bold text-nairobi-blue dark:text-blue-400">KES {trip.fare}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
