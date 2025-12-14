import React from 'react';
import {
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  Crosshair,
  Layers,
  Navigation,
} from 'lucide-react';

const MapControls = ({
  onZoomIn,
  onZoomOut,
  onRecenter,
  onToggleFullscreen,
  onToggleMapType,
  isFullscreen = false,
  showMapType = true,
  showRecenter = true,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Zoom Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <button
          onClick={onZoomIn}
          className="w-10 h-10 flex items-center justify-center border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Zoom in"
        >
          <Plus className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <button
          onClick={onZoomOut}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Zoom out"
        >
          <Minus className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* Recenter Button */}
      {showRecenter && onRecenter && (
        <button
          onClick={onRecenter}
          className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Recenter map"
        >
          <Crosshair className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      )}

      {/* Compass/Navigation */}
      <button
        onClick={onRecenter}
        className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
        title="North up"
      >
        <Navigation className="w-5 h-5 text-nairobi-blue dark:text-blue-400" />
        <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      {/* Map Type Toggle */}
      {showMapType && onToggleMapType && (
        <button
          onClick={onToggleMapType}
          className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Toggle map type"
        >
          <Layers className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      )}

      {/* Fullscreen Toggle */}
      {onToggleFullscreen && (
        <button
          onClick={onToggleFullscreen}
          className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? (
            <Minimize2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          ) : (
            <Maximize2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          )}
        </button>
      )}
    </div>
  );
};

export default MapControls;
