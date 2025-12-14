import React from 'react';
import {
  AlertTriangle,
  Info,
  XCircle,
  CheckCircle,
  Clock,
  MapPin,
  X,
} from 'lucide-react';

const AlertCard = ({ alert, onDismiss }) => {
  const getAlertConfig = (type) => {
    switch (type) {
      case 'delay':
        return {
          icon: Clock,
          color: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          titleColor: 'text-yellow-900 dark:text-yellow-300',
        };
      case 'traffic':
        return {
          icon: AlertTriangle,
          color: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
          iconColor: 'text-orange-600 dark:text-orange-400',
          titleColor: 'text-orange-900 dark:text-orange-300',
        };
      case 'route-change':
        return {
          icon: MapPin,
          color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
          iconColor: 'text-blue-600 dark:text-blue-400',
          titleColor: 'text-blue-900 dark:text-blue-300',
        };
      case 'emergency':
      case 'critical':
        return {
          icon: XCircle,
          color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
          iconColor: 'text-red-600 dark:text-red-400',
          titleColor: 'text-red-900 dark:text-red-300',
        };
      case 'success':
        return {
          icon: CheckCircle,
          color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
          iconColor: 'text-green-600 dark:text-green-400',
          titleColor: 'text-green-900 dark:text-green-300',
        };
      case 'info':
      default:
        return {
          icon: Info,
          color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
          iconColor: 'text-blue-600 dark:text-blue-400',
          titleColor: 'text-blue-900 dark:text-blue-300',
        };
    }
  };

  const config = getAlertConfig(alert.type);
  const Icon = config.icon;

  return (
    <div className={`${config.color} border-l-4 rounded-lg p-4 relative`}>
      {/* Dismiss Button */}
      {onDismiss && (
        <button
          onClick={() => onDismiss(alert.id)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="flex items-start gap-3 pr-8">
        <div className={config.iconColor}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className={`font-bold mb-1 ${config.titleColor}`}>{alert.title}</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{alert.message}</p>

          {/* Additional Info */}
          {alert.route && (
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <MapPin className="w-3 h-3" />
              <span>Route {alert.route}</span>
            </div>
          )}

          {/* Timestamp */}
          {alert.timestamp && (
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-2">
              <Clock className="w-3 h-3" />
              <span>{alert.timestamp}</span>
            </div>
          )}

          {/* Action Button */}
          {alert.action && (
            <button
              onClick={alert.action.onClick}
              className={`mt-3 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                alert.type === 'emergency' || alert.type === 'critical'
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
              }`}
            >
              {alert.action.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertCard;
