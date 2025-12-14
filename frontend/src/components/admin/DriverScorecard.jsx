import React from 'react';
import {
  Star,
  TrendingUp,
  TrendingDown,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
} from 'lucide-react';

const DriverScorecard = ({ driver }) => {
  const defaultDriver = {
    id: 1,
    name: 'John Kamau',
    phone: '+254712345678',
    vehicle: 'KCA 123A',
    route: '46',
    rating: 4.8,
    totalTrips: 342,
    totalRevenue: 456000,
    onTimeRate: 95,
    completionRate: 98,
    averageSpeed: 42,
    safetyScore: 96,
    customerSatisfaction: 4.7,
    badges: ['Top Performer', '100 Trips', 'Safe Driver'],
    performance: {
      thisMonth: {
        trips: 78,
        revenue: 98000,
        trend: 12,
      },
      lastMonth: {
        trips: 69,
        revenue: 87500,
      },
    },
  };

  const driverData = driver || defaultDriver;

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 75) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 90) return 'bg-green-100 dark:bg-green-900/30';
    if (score >= 75) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  const metrics = [
    {
      label: 'On-Time Rate',
      value: `${driverData.onTimeRate}%`,
      score: driverData.onTimeRate,
      icon: Clock,
    },
    {
      label: 'Completion Rate',
      value: `${driverData.completionRate}%`,
      score: driverData.completionRate,
      icon: CheckCircle,
    },
    {
      label: 'Safety Score',
      value: `${driverData.safetyScore}%`,
      score: driverData.safetyScore,
      icon: AlertTriangle,
    },
    {
      label: 'Customer Rating',
      value: driverData.customerSatisfaction.toFixed(1),
      score: (driverData.customerSatisfaction / 5) * 100,
      icon: Star,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {driverData.name}
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">{driverData.phone}</span>
            <span className="text-gray-400">•</span>
            <span className="text-sm font-semibold text-nairobi-blue dark:text-blue-400">
              {driverData.vehicle}
            </span>
            <span className="text-gray-400">•</span>
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-semibold">
              Route {driverData.route}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {driverData.rating}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Overall Rating</p>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={index}
              className={`p-4 rounded-lg ${getScoreBg(metric.score)} border border-gray-200 dark:border-gray-700`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${getScoreColor(metric.score)}`} />
                <span className="text-xs text-gray-600 dark:text-gray-400">{metric.label}</span>
              </div>
              <p className={`text-2xl font-bold ${getScoreColor(metric.score)}`}>
                {metric.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Trips</span>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {driverData.totalTrips}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {driverData.performance.thisMonth.trips} this month
            <span className="text-green-600 ml-2">
              +{driverData.performance.thisMonth.trend}%
            </span>
          </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            KES {driverData.totalRevenue.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            KES {driverData.performance.thisMonth.revenue.toLocaleString()} this month
          </p>
        </div>
      </div>

      {/* Badges */}
      {driverData.badges && driverData.badges.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Achievements
          </h3>
          <div className="flex flex-wrap gap-2">
            {driverData.badges.map((badge, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-matatu-yellow to-yellow-600 text-gray-900 rounded-full text-xs font-semibold flex items-center gap-1"
              >
                <Award className="w-3 h-3" />
                {badge}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverScorecard;
