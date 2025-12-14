import React, { useState, useEffect } from 'react';
import { Clock, Navigation, MapPin, TrendingDown } from 'lucide-react';

const ETACountdown = ({ initialMinutes = 12, vehiclePlate, destination }) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60); // Convert to seconds
  const [isApproaching, setIsApproaching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 0;
        const newTime = prev - 1;
        if (newTime <= 120 && !isApproaching) {
          setIsApproaching(true);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isApproaching]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) {
      return `${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  const getProgressColor = () => {
    if (timeLeft <= 120) return 'from-red-500 to-red-700'; // <= 2 min
    if (timeLeft <= 300) return 'from-yellow-500 to-yellow-700'; // <= 5 min
    return 'from-green-500 to-green-700';
  };

  const getProgressPercentage = () => {
    const totalSeconds = initialMinutes * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  if (timeLeft === 0) {
    return (
      <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl shadow-lg p-6 text-white animate-pulse">
        <div className="flex items-center justify-center gap-3">
          <MapPin className="w-8 h-8" />
          <div className="text-center">
            <h3 className="text-2xl font-bold">Vehicle Arrived!</h3>
            <p className="text-sm opacity-90 mt-1">Your matatu is here</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-br ${getProgressColor()} rounded-xl shadow-lg p-6 text-white ${
        isApproaching ? 'animate-pulse' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5" />
          <span className="text-sm font-semibold opacity-90">
            {vehiclePlate || 'Vehicle'} arriving
          </span>
        </div>
        {isApproaching && (
          <div className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full backdrop-blur">
            <TrendingDown className="w-4 h-4" />
            <span className="text-xs font-semibold">Close by</span>
          </div>
        )}
      </div>

      {/* Countdown */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Clock className="w-6 h-6" />
          <h2 className="text-5xl font-bold">{formatTime(timeLeft)}</h2>
        </div>
        <p className="text-sm opacity-90">
          {timeLeft <= 120
            ? 'Almost there!'
            : timeLeft <= 300
            ? 'Get ready'
            : 'Estimated arrival'}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className="bg-white rounded-full h-2 transition-all duration-1000"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>

      {/* Destination */}
      {destination && (
        <div className="flex items-center gap-2 p-3 bg-white/10 rounded-lg backdrop-blur">
          <MapPin className="w-4 h-4" />
          <div>
            <p className="text-xs opacity-90">Heading to</p>
            <p className="text-sm font-semibold">{destination}</p>
          </div>
        </div>
      )}

      {/* Alert message for approaching vehicles */}
      {isApproaching && (
        <div className="mt-4 p-3 bg-white/20 rounded-lg backdrop-blur text-center">
          <p className="text-sm font-semibold">
            🚨 Vehicle is approaching! Get ready to board.
          </p>
        </div>
      )}
    </div>
  );
};

export default ETACountdown;
