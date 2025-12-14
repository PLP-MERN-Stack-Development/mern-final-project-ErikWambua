import React, { useState, useEffect } from 'react';
import { Users, Car, TrendingUp, DollarSign, Activity, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalVehicles: 50,
    activeVehicles: 42,
    totalDrivers: 75,
    activeDrivers: 45,
    activeTrips: 23,
    todayTrips: 156,
    todayRevenue: 125000,
    weeklyRevenue: 850000,
    monthlyRevenue: 3200000
  });

  const [recentTrips, setRecentTrips] = useState([
    { id: 1, route: 'CBD to Westlands', driver: 'James Kamau', vehicle: 'KCA 123A', status: 'active', passengers: 12 },
    { id: 2, route: 'Ngong to Town', driver: 'Mary Wanjiru', vehicle: 'KCB 456B', status: 'active', passengers: 8 },
    { id: 3, route: 'Thika Road', driver: 'John Mwangi', vehicle: 'KCC 789C', status: 'completed', passengers: 14 },
  ]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Trips</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.activeTrips}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-nairobi-blue dark:text-blue-400" />
            </div>
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 mt-4">
            ↑ 12% from yesterday
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Vehicles</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.activeVehicles}/{stats.totalVehicles}
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 w-12 h-12 rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-matatu-green dark:text-green-400" />
            </div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">
            {Math.round((stats.activeVehicles / stats.totalVehicles) * 100)}% utilization
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Drivers</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.activeDrivers}/{stats.totalDrivers}
              </p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 w-12 h-12 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">
            {Math.round((stats.activeDrivers / stats.totalDrivers) * 100)}% on duty
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Today&apos;s Revenue</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                KES {(stats.todayRevenue / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900 w-12 h-12 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-matatu-yellow dark:text-yellow-400" />
            </div>
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 mt-4">
            ↑ 8% from yesterday
          </p>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Revenue Overview</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Daily</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  KES {stats.todayRevenue.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-nairobi-blue h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Weekly</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  KES {stats.weeklyRevenue.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-matatu-green h-2 rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Monthly</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  KES {stats.monthlyRevenue.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-matatu-yellow h-2 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-sm text-gray-700 dark:text-gray-300">Total Trips Today</span>
              <span className="text-lg font-bold text-nairobi-blue">{stats.todayTrips}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-sm text-gray-700 dark:text-gray-300">Avg per Trip</span>
              <span className="text-lg font-bold text-matatu-green">
                KES {Math.round(stats.todayRevenue / stats.todayTrips)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <span className="text-sm text-gray-700 dark:text-gray-300">Peak Hour</span>
              <span className="text-lg font-bold text-matatu-yellow">8-9 AM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Trips */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Active Trips</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Route</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Driver</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Vehicle</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Passengers</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTrips.map((trip) => (
                <tr key={trip.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{trip.route}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{trip.driver}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{trip.vehicle}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{trip.passengers}/14</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      trip.status === 'active' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {trip.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
