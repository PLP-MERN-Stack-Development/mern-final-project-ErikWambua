import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, Car, Activity } from 'lucide-react';

const Analytics = () => {
  const [period, setPeriod] = useState('week');

  const metrics = {
    revenue: { current: 850000, previous: 785000, change: 8.3 },
    trips: { current: 1092, previous: 1015, change: 7.6 },
    drivers: { current: 45, previous: 42, change: 7.1 },
    passengers: { current: 12450, previous: 11890, change: 4.7 }
  };

  const topRoutes = [
    { name: 'CBD to Westlands', trips: 245, revenue: 122500, growth: 12 },
    { name: 'Ngong to Town', trips: 189, revenue: 94500, growth: 8 },
    { name: 'Thika Road', trips: 156, revenue: 78000, growth: -3 },
    { name: 'Karen to CBD', trips: 134, revenue: 67000, growth: 15 },
  ];

  const topDrivers = [
    { name: 'James Kamau', trips: 89, revenue: 133500, rating: 4.8 },
    { name: 'Mary Wanjiru', trips: 76, revenue: 114000, rating: 4.9 },
    { name: 'John Mwangi', trips: 71, revenue: 106500, rating: 4.7 },
    { name: 'Grace Njeri', trips: 68, revenue: 102000, rating: 4.8 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Performance insights and trends</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-nairobi-blue dark:bg-gray-700 dark:text-white"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
            <div className="bg-green-100 dark:bg-green-900 w-10 h-10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            KES {(metrics.revenue.current / 1000).toFixed(0)}K
          </p>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600 font-semibold">
              {metrics.revenue.change}% from last {period}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Trips</p>
            <div className="bg-blue-100 dark:bg-blue-900 w-10 h-10 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-nairobi-blue dark:text-blue-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {metrics.trips.current.toLocaleString()}
          </p>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600 font-semibold">
              {metrics.trips.change}% from last {period}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Drivers</p>
            <div className="bg-purple-100 dark:bg-purple-900 w-10 h-10 rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {metrics.drivers.current}
          </p>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600 font-semibold">
              {metrics.drivers.change}% from last {period}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Passengers</p>
            <div className="bg-yellow-100 dark:bg-yellow-900 w-10 h-10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-matatu-yellow dark:text-yellow-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {metrics.passengers.current.toLocaleString()}
          </p>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600 font-semibold">
              {metrics.passengers.change}% from last {period}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Routes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Top Routes</h2>
          <div className="space-y-4">
            {topRoutes.map((route, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">{route.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {route.trips} trips • KES {route.revenue.toLocaleString()}
                  </p>
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                  route.growth >= 0 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {route.growth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span className="text-xs font-semibold">{Math.abs(route.growth)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Drivers */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Top Drivers</h2>
          <div className="space-y-4">
            {topDrivers.map((driver, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  <div className="bg-nairobi-blue w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
                    {driver.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{driver.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {driver.trips} trips • ⭐ {driver.rating}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  KES {(driver.revenue / 1000).toFixed(0)}K
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
