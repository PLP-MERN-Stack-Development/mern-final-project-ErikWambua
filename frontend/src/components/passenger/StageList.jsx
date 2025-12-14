import React, { useState } from 'react';
import { MapPin, Navigation, Clock, Users, TrendingUp } from 'lucide-react';

const StageList = ({ stages, onStageSelect, selectedStage }) => {
  const defaultStages = [
    {
      id: 1,
      name: 'Kencom Stage',
      location: 'CBD, Nairobi',
      type: 'major',
      waitingPassengers: 12,
      avgWaitTime: '5 min',
      coordinates: [-1.2864, 36.8172],
    },
    {
      id: 2,
      name: 'Uhuru Highway Stop',
      location: 'Along Uhuru Highway',
      type: 'regular',
      waitingPassengers: 5,
      avgWaitTime: '8 min',
      coordinates: [-1.2921, 36.8219],
    },
    {
      id: 3,
      name: 'Museum Hill',
      location: 'Museum Hill Roundabout',
      type: 'regular',
      waitingPassengers: 8,
      avgWaitTime: '6 min',
      coordinates: [-1.2955, 36.8147],
    },
    {
      id: 4,
      name: 'ABC Place',
      location: 'Waiyaki Way',
      type: 'major',
      waitingPassengers: 15,
      avgWaitTime: '4 min',
      coordinates: [-1.2634, 36.7892],
    },
    {
      id: 5,
      name: 'Sarit Centre',
      location: 'Westlands',
      type: 'major',
      waitingPassengers: 20,
      avgWaitTime: '3 min',
      coordinates: [-1.2615, 36.7998],
    },
  ];

  const stageList = stages || defaultStages;
  const [filter, setFilter] = useState('all'); // all, major, regular

  const filteredStages = stageList.filter(
    (stage) => filter === 'all' || stage.type === filter
  );

  const getStageIcon = (type) => {
    return type === 'major' ? '🚏' : '📍';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Pickup Stages</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {filteredStages.length} stages available
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {['all', 'major', 'regular'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors capitalize ${
              filter === f
                ? 'bg-nairobi-blue text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Stages List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredStages.map((stage) => {
          const isSelected = selectedStage?.id === stage.id;

          return (
            <div
              key={stage.id}
              onClick={() => onStageSelect && onStageSelect(stage)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-nairobi-blue bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{getStageIcon(stage.type)}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{stage.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {stage.location}
                        </span>
                      </div>
                    </div>
                    {stage.type === 'major' && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold">
                        Major Stage
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Waiting</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {stage.waitingPassengers}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Avg Wait</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {stage.avgWaitTime}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Stage Info */}
      {selectedStage && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-nairobi-blue">
          <div className="flex items-center gap-2 mb-2">
            <Navigation className="w-4 h-4 text-nairobi-blue dark:text-blue-400" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Selected Stage: {selectedStage.name}
            </p>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            You'll be picked up from this location
          </p>
        </div>
      )}
    </div>
  );
};

export default StageList;
