import React, { useState } from 'react';
import { Power, Clock, TrendingUp, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

const DriverStatus = ({ initialStatus = 'offline', onStatusChange }) => {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    const newStatus = status === 'online' ? 'offline' : 'online';

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStatus(newStatus);
      if (onStatusChange) {
        onStatusChange(newStatus);
      }

      toast.success(
        newStatus === 'online'
          ? 'You are now online and ready to accept trips'
          : 'You are now offline'
      );
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  // Mock stats - in real app, these would come from props
  const stats = {
    todayTrips: 12,
    todayEarnings: 4200,
    hoursOnline: 6.5,
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* Status Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Driver Status
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {status === 'online'
              ? 'You are online and accepting trips'
              : 'Go online to start accepting trips'}
          </p>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${
          status === 'online'
            ? 'bg-gradient-to-r from-green-500 to-green-700 text-white shadow-lg shadow-green-500/50'
            : 'bg-gradient-to-r from-gray-400 to-gray-600 text-white'
        }`}
      >
        {loading ? (
          <>
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Updating...
          </>
        ) : (
          <>
            <Power className="w-6 h-6" />
            {status === 'online' ? 'GO OFFLINE' : 'GO ONLINE'}
          </>
        )}
      </button>

      {/* Today's Stats */}
      {status === 'online' && (
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-5 h-5 text-nairobi-blue dark:text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.todayTrips}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Trips Today</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-2">
              <DollarSign className="w-5 h-5 text-matatu-green dark:text-green-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.todayEarnings}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">KES Earned</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.hoursOnline}h
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Online Time</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverStatus;
