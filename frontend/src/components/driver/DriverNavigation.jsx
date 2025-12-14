import React, { useState, useEffect } from 'react';
import {
  Navigation,
  TurnRight,
  TurnLeft,
  ArrowUp,
  MapPin,
  Clock,
  Gauge,
} from 'lucide-react';

const DriverNavigation = ({ destination, currentLocation }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [eta, setEta] = useState('12 min');
  const [distance, setDistance] = useState('3.2 km');

  const navigationSteps = [
    {
      instruction: 'Head north on Kenyatta Avenue',
      distance: '500 m',
      icon: ArrowUp,
      type: 'straight',
    },
    {
      instruction: 'Turn right onto Uhuru Highway',
      distance: '1.2 km',
      icon: TurnRight,
      type: 'turn-right',
    },
    {
      instruction: 'Continue straight for 2 km',
      distance: '2.0 km',
      icon: ArrowUp,
      type: 'straight',
    },
    {
      instruction: 'Turn left onto Waiyaki Way',
      distance: '800 m',
      icon: TurnLeft,
      type: 'turn-left',
    },
    {
      instruction: 'Your destination will be on the right',
      distance: '200 m',
      icon: MapPin,
      type: 'arrival',
    },
  ];

  const step = navigationSteps[currentStep];
  const StepIcon = step?.icon || Navigation;

  // Simulate navigation progress
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < navigationSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 10000); // Advance every 10 seconds for demo

    return () => clearInterval(interval);
  }, []);

  const getStepColor = (type) => {
    switch (type) {
      case 'turn-right':
      case 'turn-left':
        return 'bg-yellow-500';
      case 'arrival':
        return 'bg-green-500';
      default:
        return 'bg-nairobi-blue';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Current Instruction - Large Display */}
      <div className={`p-6 ${getStepColor(step?.type)} text-white`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
            <StepIcon className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <p className="text-sm opacity-90 mb-1">In {step?.distance}</p>
            <p className="text-xl font-bold">{step?.instruction}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className="bg-white rounded-full h-2 transition-all duration-500"
            style={{
              width: `${((currentStep + 1) / navigationSteps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Trip Stats */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">ETA</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{eta}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Navigation className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Distance</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{distance}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Gauge className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Speed</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">45 km/h</p>
        </div>
      </div>

      {/* Upcoming Steps */}
      <div className="p-4">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Upcoming Steps
        </h4>
        <div className="space-y-2">
          {navigationSteps.slice(currentStep + 1, currentStep + 4).map((upcomingStep, index) => {
            const UpcomingIcon = upcomingStep.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <UpcomingIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {upcomingStep.instruction}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {upcomingStep.distance}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Destination Info */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-red-600 dark:text-red-400" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Destination</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {destination || 'Westlands, Nairobi'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverNavigation;
