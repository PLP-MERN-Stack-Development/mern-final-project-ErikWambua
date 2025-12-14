import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, AlertCircle, CheckCircle, Trash2, Check, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'matpulse_notifications';

const defaultNotifications = [
  {
    id: 1,
    type: 'info',
    title: 'Route 46 Update',
    message: 'Your favorite route has new matatus available',
    time: '5 minutes ago',
    read: false,
    iconType: 'Bell',
  },
  {
    id: 2,
    type: 'success',
    title: 'Trip Completed',
    message: 'Your trip from CBD to Westlands has been completed',
    time: '2 hours ago',
    read: false,
    iconType: 'CheckCircle',
  },
  {
    id: 3,
    type: 'alert',
    title: 'Route Delay',
    message: 'Route 33 is experiencing delays due to traffic',
    time: '3 hours ago',
    read: true,
    iconType: 'AlertCircle',
  },
  {
    id: 4,
    type: 'message',
    title: 'New Message',
    message: 'Driver John Kamau sent you a message',
    time: '1 day ago',
    read: true,
    iconType: 'MessageSquare',
  },
  {
    id: 5,
    type: 'info',
    title: 'Fare Update',
    message: 'Route 46 fares have been updated. Check the new rates.',
    time: '2 days ago',
    read: true,
    iconType: 'Bell',
  },
];

const getIconComponent = (iconType) => {
  const icons = { Bell, MessageSquare, AlertCircle, CheckCircle };
  return icons[iconType] || Bell;
};

const Notifications = () => {
  const [filter, setFilter] = useState('all'); // all, unread, read
  
  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultNotifications;
  });

  // Persist to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    toast.success('All notifications marked as read');
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
    toast.success('Notification deleted');
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast.success('All notifications cleared');
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'info':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'success':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'alert':
        return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      case 'message':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-nairobi-blue to-blue-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-semibold">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-blue-100">Stay updated with your trips and routes</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Actions Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'all'
                    ? 'bg-nairobi-blue text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'unread'
                    ? 'bg-nairobi-blue text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'read'
                    ? 'bg-nairobi-blue text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Read ({notifications.filter(n => n.read).length})
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Mark All Read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {filter === 'unread' ? 'No unread notifications' : filter === 'read' ? 'No read notifications' : 'No notifications'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === 'all' ? 'You are all caught up!' : 'Try changing the filter'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const Icon = getIconComponent(notification.iconType);
              return (
                <div
                  key={notification.id}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 ${
                    !notification.read ? 'border-l-4 border-nairobi-blue' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      getTypeColor(notification.type)
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          {notification.title}
                          {!notification.read && (
                            <span className="ml-2 inline-block w-2 h-2 bg-nairobi-blue rounded-full" />
                          )}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-xs font-semibold text-nairobi-blue dark:text-blue-400 hover:underline"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
