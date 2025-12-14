import React from 'react';
import { TrendingUp, TrendingDown, Navigation, Users, DollarSign, Car } from 'lucide-react';

const DashboardStats = ({ stats }) => {
  const defaultStats = {
    activeTrips: 45,
    totalVehicles: 120,
    activeDrivers: 98,
    todayRevenue: 125000,
    tripsTrend: 12,
    vehiclesTrend: 5,
    driversTrend: 8,
    revenueTrend: 15,
  };

  const data = stats || defaultStats;

  const statCards = [
    {
      id: 1,
      title: 'Active Trips',
      value: data.activeTrips,
      trend: data.tripsTrend,
      icon: Navigation,
      color: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-nairobi-blue dark:text-blue-400',
      trendColor: data.tripsTrend >= 0 ? 'text-green-600' : 'text-red-600',
    },
    {
      id: 2,
      title: 'Total Vehicles',
      value: data.totalVehicles,
      trend: data.vehiclesTrend,
      icon: Car,
      color: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      trendColor: data.vehiclesTrend >= 0 ? 'text-green-600' : 'text-red-600',
    },
    {
      id: 3,
      title: 'Active Drivers',
      value: data.activeDrivers,
      trend: data.driversTrend,
      icon: Users,
      color: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-matatu-green dark:text-green-400',
      trendColor: data.driversTrend >= 0 ? 'text-green-600' : 'text-red-600',
    },
    {
      id: 4,
      title: 'Today Revenue',
      value: `KES ${data.todayRevenue.toLocaleString()}`,
      trend: data.revenueTrend,
      icon: DollarSign,
      color: 'bg-yellow-100 dark:bg-yellow-900/30',
      iconColor: 'text-matatu-yellow dark:text-yellow-400',
      trendColor: data.revenueTrend >= 0 ? 'text-green-600' : 'text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trend >= 0 ? TrendingUp : TrendingDown;
        
        return (
          <div
            key={stat.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <div className={`flex items-center gap-1 ${stat.trendColor}`}>
                <TrendIcon className="w-4 h-4" />
                <span className="text-sm font-semibold">{Math.abs(stat.trend)}%</span>
              </div>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
              {stat.title}
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
