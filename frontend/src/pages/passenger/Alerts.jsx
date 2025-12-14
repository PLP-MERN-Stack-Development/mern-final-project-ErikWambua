import React, { useState } from 'react';
import { Bell, BellOff, Plus, X, Search, Clock, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const Alerts = () => {
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newAlert, setNewAlert] = useState({
    route: '',
    type: 'delay', // delay, arrival, capacity
    enabled: true,
  });

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      route: 'Route 46',
      routeNumber: '46',
      type: 'arrival',
      description: 'Notify when matatu is 5 min away',
      enabled: true,
      createdAt: '2024-01-10',
    },
    {
      id: 2,
      route: 'Route 33',
      routeNumber: '33',
      type: 'delay',
      description: 'Notify about traffic delays',
      enabled: true,
      createdAt: '2024-01-08',
    },
    {
      id: 3,
      route: 'Route 11',
      routeNumber: '11',
      type: 'capacity',
      description: 'Notify when matatu has available seats',
      enabled: false,
      createdAt: '2024-01-05',
    },
  ]);

  const availableRoutes = [
    { number: '46', name: 'CBD - Westlands' },
    { number: '33', name: 'Ngong Road - CBD' },
    { number: '11', name: 'Thika Road - CBD' },
    { number: '24', name: 'Karen - CBD' },
    { number: '45', name: 'Kilimani - CBD' },
  ];

  const alertTypes = [
    { value: 'arrival', label: 'Matatu Arrival', description: 'Get notified when matatu is nearby' },
    { value: 'delay', label: 'Traffic Delays', description: 'Get notified about route delays' },
    { value: 'capacity', label: 'Seat Availability', description: 'Get notified when seats are available' },
  ];

  const handleToggleAlert = (id) => {
    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
    ));
    const alert = alerts.find(a => a.id === id);
    toast.success(alert.enabled ? 'Alert disabled' : 'Alert enabled');
  };

  const handleDeleteAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast.success('Alert deleted');
  };

  const handleAddAlert = () => {
    if (!newAlert.route) {
      toast.error('Please select a route');
      return;
    }

    const route = availableRoutes.find(r => r.number === newAlert.route);
    const alertType = alertTypes.find(t => t.value === newAlert.type);
    
    const alert = {
      id: Date.now(),
      route: `Route ${route.number}`,
      routeNumber: route.number,
      type: newAlert.type,
      description: alertType.description,
      enabled: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setAlerts([alert, ...alerts]);
    setNewAlert({ route: '', type: 'delay', enabled: true });
    setShowAddAlert(false);
    toast.success('Alert added successfully');
  };

  const getAlertTypeIcon = (type) => {
    switch (type) {
      case 'arrival':
        return <Clock className="w-5 h-5" />;
      case 'delay':
        return <MapPin className="w-5 h-5" />;
      case 'capacity':
        return <Bell className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getAlertTypeColor = (type) => {
    switch (type) {
      case 'arrival':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'delay':
        return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      case 'capacity':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const filteredAlerts = alerts.filter(alert =>
    alert.route.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-nairobi-blue to-blue-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Route Alerts</h1>
          <p className="text-blue-100">Manage your route notifications and alerts</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search alerts..."
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-nairobi-blue dark:text-white"
            />
          </div>
          <button
            onClick={() => setShowAddAlert(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-nairobi-blue text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Add Alert
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-nairobi-blue dark:text-blue-400">{alerts.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Alerts</p>
              </div>
              <Bell className="w-10 h-10 text-nairobi-blue dark:text-blue-400" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-matatu-green dark:text-green-400">
                  {alerts.filter(a => a.enabled).length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active</p>
              </div>
              <Bell className="w-10 h-10 text-matatu-green dark:text-green-400 fill-current" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-400 dark:text-gray-500">
                  {alerts.filter(a => !a.enabled).length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Disabled</p>
              </div>
              <BellOff className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
        </div>

        {/* Add Alert Modal */}
        {showAddAlert && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Alert</h2>
                <button
                  onClick={() => setShowAddAlert(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Route
                  </label>
                  <select
                    value={newAlert.route}
                    onChange={(e) => setNewAlert({ ...newAlert, route: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-nairobi-blue dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Choose a route...</option>
                    {availableRoutes.map((route) => (
                      <option key={route.number} value={route.number}>
                        Route {route.number} - {route.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Alert Type
                  </label>
                  <div className="space-y-2">
                    {alertTypes.map((type) => (
                      <label
                        key={type.value}
                        className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          newAlert.type === type.value
                            ? 'border-nairobi-blue bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="alertType"
                          value={type.value}
                          checked={newAlert.type === type.value}
                          onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
                          className="text-nairobi-blue focus:ring-nairobi-blue"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white">{type.label}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{type.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddAlert(false)}
                    className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddAlert}
                    className="flex-1 py-3 bg-nairobi-blue text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors"
                  >
                    Add Alert
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alerts List */}
        {filteredAlerts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No alerts found' : 'No alerts yet'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery
                ? 'Try a different search term'
                : 'Add alerts to get notified about your favorite routes'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowAddAlert(true)}
                className="px-6 py-3 bg-nairobi-blue text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors"
              >
                Add Your First Alert
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    getAlertTypeColor(alert.type)
                  }`}>
                    {getAlertTypeIcon(alert.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-8 h-8 bg-nairobi-blue text-white rounded flex items-center justify-center text-sm font-bold">
                            {alert.routeNumber}
                          </div>
                          <h3 className="font-bold text-gray-900 dark:text-white">{alert.route}</h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{alert.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Created: {new Date(alert.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={alert.enabled}
                        onChange={() => handleToggleAlert(alert.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-nairobi-blue"></div>
                    </label>
                    <button
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
