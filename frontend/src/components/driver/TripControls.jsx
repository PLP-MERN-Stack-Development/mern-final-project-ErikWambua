import React, { useState } from 'react';
import { Play, Pause, CheckCircle, XCircle, MapPin, Navigation } from 'lucide-react';
import toast from 'react-hot-toast';

const TripControls = ({ trip, onStart, onPause, onResume, onComplete, onCancel }) => {
  const [status, setStatus] = useState(trip?.status || 'pending'); // pending, active, paused, completed
  const [loading, setLoading] = useState(false);

  const handleAction = async (action) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      switch (action) {
        case 'start':
          setStatus('active');
          toast.success('Trip started!');
          if (onStart) onStart(trip);
          break;
        case 'pause':
          setStatus('paused');
          toast.success('Trip paused');
          if (onPause) onPause(trip);
          break;
        case 'resume':
          setStatus('active');
          toast.success('Trip resumed');
          if (onResume) onResume(trip);
          break;
        case 'complete':
          setStatus('completed');
          toast.success('Trip completed! Well done!');
          if (onComplete) onComplete(trip);
          break;
        case 'cancel':
          if (window.confirm('Are you sure you want to cancel this trip?')) {
            setStatus('cancelled');
            toast.error('Trip cancelled');
            if (onCancel) onCancel(trip);
          }
          break;
        default:
          break;
      }
    } catch (error) {
      toast.error('Action failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!trip) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
        <Navigation className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-gray-600 dark:text-gray-400">No active trip</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* Trip Info */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Active Trip</h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              status === 'active'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : status === 'paused'
                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">From</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {trip.origin || 'CBD, Nairobi'}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-red-600 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">To</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {trip.destination || 'Westlands'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Passengers</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {trip.passengers || 8}
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Fare</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              KES {trip.fare || 350}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-3">
        {status === 'pending' && (
          <button
            onClick={() => handleAction('start')}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Play className="w-5 h-5" />
                Start Trip
              </>
            )}
          </button>
        )}

        {status === 'active' && (
          <>
            <button
              onClick={() => handleAction('pause')}
              disabled={loading}
              className="w-full py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Pause className="w-5 h-5" />
                  Pause Trip
                </>
              )}
            </button>
            <button
              onClick={() => handleAction('complete')}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-nairobi-blue to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Complete Trip
                </>
              )}
            </button>
          </>
        )}

        {status === 'paused' && (
          <button
            onClick={() => handleAction('resume')}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Play className="w-5 h-5" />
                Resume Trip
              </>
            )}
          </button>
        )}

        {(status === 'pending' || status === 'paused') && (
          <button
            onClick={() => handleAction('cancel')}
            disabled={loading}
            className="w-full py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <XCircle className="w-5 h-5" />
                Cancel Trip
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default TripControls;
