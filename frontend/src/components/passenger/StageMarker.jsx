import React from 'react';
import { MapPin } from 'lucide-react';

const StageMarker = ({ stage, onClick, isSelected = false }) => {
  const isMajor = stage.type === 'major';

  return (
    <div
      onClick={() => onClick && onClick(stage)}
      className="relative cursor-pointer transform transition-all hover:scale-110"
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -100%)',
      }}
    >
      {/* Pulsing ring for selected/major stages */}
      {(isSelected || isMajor) && (
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
            isSelected ? 'w-16 h-16 bg-nairobi-blue' : 'w-12 h-12 bg-blue-500'
          } rounded-full opacity-20 animate-ping`}
        />
      )}

      {/* Main Marker */}
      <div
        className={`relative ${
          isMajor ? 'w-10 h-10' : 'w-8 h-8'
        } rounded-full flex items-center justify-center shadow-lg transition-all ${
          isSelected
            ? 'bg-nairobi-blue border-4 border-white scale-125'
            : isMajor
            ? 'bg-blue-600 border-3 border-white'
            : 'bg-gray-600 border-2 border-white'
        }`}
      >
        <MapPin
          className={`${
            isMajor ? 'w-5 h-5' : 'w-4 h-4'
          } text-white`}
        />
      </div>

      {/* Stage Label */}
      {(isSelected || isMajor) && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <div className="px-2 py-1 bg-white dark:bg-gray-800 rounded shadow-lg border border-gray-200 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-900 dark:text-white">
              {stage.name}
            </p>
            {stage.waitingPassengers !== undefined && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stage.waitingPassengers} waiting
              </p>
            )}
          </div>
        </div>
      )}

      {/* Waiting indicator badge */}
      {isMajor && stage.waitingPassengers > 10 && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">
          {stage.waitingPassengers > 20 ? '20+' : stage.waitingPassengers}
        </div>
      )}
    </div>
  );
};

export default StageMarker;
