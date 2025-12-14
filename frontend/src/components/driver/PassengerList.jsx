import React from 'react';
import { Users, Phone, MapPin, CheckCircle, Clock } from 'lucide-react';

const PassengerList = ({ passengers, maxCapacity = 14 }) => {
  const defaultPassengers = [
    {
      id: 1,
      name: 'John Kamau',
      phone: '+254712345678',
      pickup: 'CBD, Kencom',
      dropoff: 'Westlands',
      status: 'boarded',
      fare: 100,
    },
    {
      id: 2,
      name: 'Mary Wanjiru',
      phone: '+254723456789',
      pickup: 'Uhuru Highway',
      dropoff: 'ABC Place',
      status: 'boarded',
      fare: 80,
    },
    {
      id: 3,
      name: 'Peter Omondi',
      phone: '+254734567890',
      pickup: 'Museum Hill',
      dropoff: 'Sarit Centre',
      status: 'waiting',
      fare: 100,
    },
  ];

  const passengerList = passengers || defaultPassengers;
  const currentCount = passengerList.filter((p) => p.status === 'boarded').length;
  const occupancyPercentage = (currentCount / maxCapacity) * 100;

  const getStatusColor = (status) => {
    switch (status) {
      case 'boarded':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'waiting':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'completed':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            Passengers
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {currentCount} of {maxCapacity} seats occupied
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Boarded</p>
        </div>
      </div>

      {/* Occupancy Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-600 dark:text-gray-400">Occupancy</span>
          <span className="text-xs font-semibold text-gray-900 dark:text-white">
            {Math.round(occupancyPercentage)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              occupancyPercentage >= 90
                ? 'bg-red-500'
                : occupancyPercentage >= 70
                ? 'bg-yellow-500'
                : 'bg-green-500'
            }`}
            style={{ width: `${occupancyPercentage}%` }}
          />
        </div>
      </div>

      {/* Passengers List */}
      {passengerList.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">No passengers yet</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {passengerList.map((passenger, index) => (
            <div
              key={passenger.id}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-nairobi-blue to-blue-700 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {passenger.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {passenger.phone}
                      </span>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    passenger.status
                  )}`}
                >
                  {passenger.status.charAt(0).toUpperCase() + passenger.status.slice(1)}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Pickup</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {passenger.pickup}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Dropoff</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {passenger.dropoff}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Fare</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  KES {passenger.fare}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Total Fare */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Total Fare</span>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            KES {passengerList.reduce((sum, p) => sum + p.fare, 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PassengerList;
