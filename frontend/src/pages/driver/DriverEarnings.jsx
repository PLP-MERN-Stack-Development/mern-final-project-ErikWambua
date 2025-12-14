import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar, Download, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const DriverEarnings = () => {
  const [period, setPeriod] = useState('week'); // day, week, month, year
  const [showFilter, setShowFilter] = useState(false);

  // Mock earnings data
  const earnings = {
    today: 2500,
    week: 15400,
    month: 58900,
    year: 685000,
    todayTrips: 12,
    weekTrips: 87,
    monthTrips: 342,
    yearTrips: 4128,
  };

  // Mock daily earnings for the week
  const dailyEarnings = [
    { day: 'Mon', amount: 2100, trips: 11 },
    { day: 'Tue', amount: 2400, trips: 13 },
    { day: 'Wed', amount: 1900, trips: 10 },
    { day: 'Thu', amount: 2800, trips: 15 },
    { day: 'Fri', amount: 3200, trips: 17 },
    { day: 'Sat', amount: 2500, trips: 12 },
    { day: 'Sun', amount: 2000, trips: 9 },
  ];

  // Mock recent transactions
  const transactions = [
    { id: 1, date: '2024-01-15', time: '08:30 AM', route: 'CBD - Westlands', amount: 80, type: 'trip' },
    { id: 2, date: '2024-01-15', time: '09:15 AM', route: 'Ngong Road - CBD', amount: 50, type: 'trip' },
    { id: 3, date: '2024-01-15', time: '10:00 AM', route: 'Thika Road - CBD', amount: 100, type: 'trip' },
    { id: 4, date: '2024-01-14', time: '05:30 PM', route: 'CBD - Westlands', amount: 80, type: 'trip' },
    { id: 5, date: '2024-01-14', time: '06:15 PM', route: 'Karen - CBD', amount: 120, type: 'trip' },
  ];

  const getPeriodData = () => {
    switch (period) {
      case 'day':
        return { amount: earnings.today, trips: earnings.todayTrips, change: '+12%' };
      case 'week':
        return { amount: earnings.week, trips: earnings.weekTrips, change: '+8%' };
      case 'month':
        return { amount: earnings.month, trips: earnings.monthTrips, change: '+15%' };
      case 'year':
        return { amount: earnings.year, trips: earnings.yearTrips, change: '+22%' };
      default:
        return { amount: earnings.week, trips: earnings.weekTrips, change: '+8%' };
    }
  };

  const handleExport = () => {
    toast.success('Exporting earnings report...');
  };

  const maxEarning = Math.max(...dailyEarnings.map(d => d.amount));
  const periodData = getPeriodData();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-nairobi-blue to-blue-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Earnings</h1>
          <p className="text-blue-100">Track your income and transactions</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Period Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              {['day', 'week', 'month', 'year'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors capitalize ${
                    period === p
                      ? 'bg-nairobi-blue text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {p === 'day' ? 'Today' : `This ${p}`}
                </button>
              ))}
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Main Earnings Card */}
        <div className="bg-gradient-to-br from-matatu-green to-green-700 rounded-xl shadow-lg p-8 mb-6 text-white">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-green-100 mb-2">Total Earnings</p>
              <h2 className="text-5xl font-bold mb-2">KES {periodData.amount.toLocaleString()}</h2>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-lg font-semibold">{periodData.change} from last {period}</span>
              </div>
            </div>
            <div className="text-right">
              <DollarSign className="w-16 h-16 text-white/30" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/20">
            <div>
              <p className="text-green-100 text-sm">Total Trips</p>
              <p className="text-2xl font-bold">{periodData.trips}</p>
            </div>
            <div>
              <p className="text-green-100 text-sm">Avg per Trip</p>
              <p className="text-2xl font-bold">KES {Math.round(periodData.amount / periodData.trips)}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Today</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">KES {earnings.today.toLocaleString()}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{earnings.todayTrips} trips</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">This Week</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">KES {earnings.week.toLocaleString()}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{earnings.weekTrips} trips</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">This Month</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">KES {earnings.month.toLocaleString()}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{earnings.monthTrips} trips</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">This Year</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">KES {earnings.year.toLocaleString()}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{earnings.yearTrips} trips</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Earnings Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Daily Earnings (This Week)</h2>
            <div className="space-y-4">
              {dailyEarnings.map((day) => (
                <div key={day.day}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white w-12">{day.day}</span>
                    <div className="flex-1 mx-4">
                      <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-8 relative overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-nairobi-blue to-blue-700 h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                          style={{ width: `${(day.amount / maxEarning) * 100}%` }}
                        >
                          <span className="text-white text-xs font-semibold">
                            {(day.amount / maxEarning) * 100 > 20 ? `KES ${day.amount}` : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right w-32">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">KES {day.amount}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{day.trips} trips</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Transactions</h2>
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{transaction.route}</p>
                    <span className="text-sm font-bold text-matatu-green">+KES {transaction.amount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.date}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="w-full mt-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              View All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverEarnings;
