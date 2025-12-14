import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  Bell,
  Clock,
  Trash2,
  Eye,
  Filter,
} from 'lucide-react';

const AlertManager = ({ alerts: initialAlerts, onDismiss, onView }) => {
  const [filter, setFilter] = useState('all'); // all, critical, warning, info

  const defaultAlerts = [
    {
      id: 1,
      type: 'critical',
      title: 'Vehicle Breakdown',
      message: 'KCA 123A reported engine failure on Route 46',
      timestamp: '5 min ago',
      read: false,
    },
    {
      id: 2,
      type: 'warning',
      title: 'Driver Late',
      message: 'Driver John Kamau is 30 minutes late for shift',
      timestamp: '15 min ago',
      read: false,
    },
    {
      id: 3,
      type: 'info',
      title: 'New Booking',
      message: 'New reservation received for Route 11',
      timestamp: '1 hour ago',
      read: true,
    },
    {
      id: 4,
      type: 'warning',
      title: 'Low Fuel Alert',
      message: 'KCB 456B fuel level below 20%',
      timestamp: '2 hours ago',
      read: true,
    },
  ];

  const alerts = initialAlerts || defaultAlerts;
  const [localAlerts, setLocalAlerts] = useState(alerts);

  const filteredAlerts = localAlerts.filter(
    (alert) => filter === 'all' || alert.type === filter
  );

  const getAlertStyle = (type) => {
    switch (type) {
      case 'critical':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          icon: XCircle,
          iconColor: 'text-red-600 dark:text-red-400',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-200 dark:border-yellow-800',
          icon: AlertTriangle,
          iconColor: 'text-yellow-600 dark:text-yellow-400',
        };
      case 'info':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          icon: Info,
          iconColor: 'text-blue-600 dark:text-blue-400',
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-700/20',
          border: 'border-gray-200 dark:border-gray-700',
          icon: Bell,
          iconColor: 'text-gray-600 dark:text-gray-400',
        };
    }
  };

  const handleDismiss = (alertId) => {
    setLocalAlerts(localAlerts.filter((a) => a.id !== alertId));
    if (onDismiss) onDismiss(alertId);
  };

  const unreadCount = localAlerts.filter((a) => !a.read).length;
  const criticalCount = localAlerts.filter((a) => a.type === 'critical').length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6" />
            Alert Manager
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {unreadCount} unread • {criticalCount} critical
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {['all', 'critical', 'warning', 'info'].map((f) => (
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
            {f !== 'all' && (
              <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {localAlerts.filter((a) => a.type === f).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No alerts to display</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => {
            const style = getAlertStyle(alert.type);
            const Icon = style.icon;

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${style.bg} ${style.border} transition-all ${
                  !alert.read ? 'shadow-md' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 ${style.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {alert.title}
                        {!alert.read && (
                          <span className="w-2 h-2 bg-nairobi-blue rounded-full" />
                        )}
                      </h3>
                      <div className="flex items-center gap-2">
                        {onView && (
                          <button
                            onClick={() => onView(alert)}
                            className="text-gray-400 hover:text-nairobi-blue transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDismiss(alert.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3" />
                      {alert.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AlertManager;
