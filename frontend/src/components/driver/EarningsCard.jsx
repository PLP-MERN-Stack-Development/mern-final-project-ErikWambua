import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

const EarningsCard = ({ earnings, period = 'today' }) => {
  const defaultEarnings = {
    total: 4200,
    trips: 12,
    avgPerTrip: 350,
    trend: 15, // percentage
    previousPeriod: 3652,
  };

  const data = earnings || defaultEarnings;
  const change = data.total - data.previousPeriod;
  const isPositive = change >= 0;

  const getPeriodLabel = () => {
    switch (period) {
      case 'today':
        return 'Today';
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      case 'year':
        return 'This Year';
      default:
        return 'Today';
    }
  };

  return (
    <div className="bg-gradient-to-br from-nairobi-blue to-blue-700 rounded-xl shadow-lg p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm opacity-90">Earnings</p>
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              <span className="text-xs font-semibold">{getPeriodLabel()}</span>
            </div>
          </div>
        </div>
        <div
          className={`flex items-center gap-1 px-3 py-1 rounded-full ${
            isPositive ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span className="text-sm font-semibold">{Math.abs(data.trend)}%</span>
        </div>
      </div>

      {/* Total Earnings */}
      <div className="mb-6">
        <p className="text-4xl font-bold mb-1">KES {data.total.toLocaleString()}</p>
        <p className="text-sm opacity-90">
          {isPositive ? '+' : ''}KES {change.toLocaleString()} from last {period}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white/10 rounded-lg backdrop-blur">
          <p className="text-sm opacity-90 mb-1">Total Trips</p>
          <p className="text-2xl font-bold">{data.trips}</p>
        </div>
        <div className="p-4 bg-white/10 rounded-lg backdrop-blur">
          <p className="text-sm opacity-90 mb-1">Avg per Trip</p>
          <p className="text-2xl font-bold">KES {data.avgPerTrip}</p>
        </div>
      </div>

      {/* Progress Bar (optional - shows progress toward a goal) */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs opacity-90">Daily Goal: KES 5,000</span>
          <span className="text-xs font-semibold">{Math.round((data.total / 5000) * 100)}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className="bg-white rounded-full h-2 transition-all duration-500"
            style={{ width: `${Math.min((data.total / 5000) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default EarningsCard;
