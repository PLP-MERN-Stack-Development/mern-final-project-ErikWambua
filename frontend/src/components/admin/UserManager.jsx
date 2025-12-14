import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Star,
} from 'lucide-react';
import toast from 'react-hot-toast';

const UserManager = ({ users: initialUsers, onEdit, onDelete, onStatusChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, drivers, passengers, active, blocked

  const defaultUsers = [
    {
      id: 1,
      name: 'John Kamau',
      email: 'john@example.com',
      phone: '+254712345678',
      role: 'driver',
      status: 'active',
      vehicle: 'KCA 123A',
      route: '46',
      rating: 4.8,
      trips: 342,
      joined: '2023-01-15',
    },
    {
      id: 2,
      name: 'Mary Wanjiru',
      email: 'mary@example.com',
      phone: '+254723456789',
      role: 'passenger',
      status: 'active',
      rating: 4.5,
      trips: 89,
      joined: '2023-03-20',
    },
    {
      id: 3,
      name: 'Peter Omondi',
      email: 'peter@example.com',
      phone: '+254734567890',
      role: 'driver',
      status: 'blocked',
      vehicle: 'KCB 456B',
      route: '33',
      rating: 3.2,
      trips: 156,
      joined: '2022-11-10',
    },
    {
      id: 4,
      name: 'Grace Akinyi',
      email: 'grace@example.com',
      phone: '+254745678901',
      role: 'passenger',
      status: 'active',
      rating: 4.9,
      trips: 234,
      joined: '2023-02-05',
    },
  ];

  const users = initialUsers || defaultUsers;

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === '' ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);

    const matchesFilter =
      filter === 'all' ||
      user.role === filter ||
      user.status === filter;

    return matchesSearch && matchesFilter;
  });

  const handleStatusToggle = (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    toast.success(
      `User ${newStatus === 'active' ? 'activated' : 'blocked'} successfully`
    );
    if (onStatusChange) onStatusChange(userId, newStatus);
  };

  const handleDelete = (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      toast.success('User deleted successfully');
      if (onDelete) onDelete(userId);
    }
  };

  const stats = {
    total: users.length,
    drivers: users.filter((u) => u.role === 'driver').length,
    passengers: users.filter((u) => u.role === 'passenger').length,
    active: users.filter((u) => u.status === 'active').length,
    blocked: users.filter((u) => u.status === 'blocked').length,
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6" />
            User Management
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {stats.total} total users • {stats.drivers} drivers • {stats.passengers} passengers
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Total Users</p>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.drivers}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Drivers</p>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.passengers}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Passengers</p>
        </div>
        <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
          <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{stats.active}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Active</p>
        </div>
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.blocked}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Blocked</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-nairobi-blue dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'drivers', 'passengers', 'active', 'blocked'].map((f) => (
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
      </div>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No users found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-nairobi-blue to-blue-700 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {user.name.charAt(0)}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-900 dark:text-white">{user.name}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'driver'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Phone className="w-4 h-4" />
                        <span>{user.phone}</span>
                      </div>
                      {user.vehicle && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span>
                            {user.vehicle} - Route {user.route}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>
                          {user.rating} ({user.trips} trips)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(user)}
                      className="p-2 text-gray-400 hover:text-nairobi-blue transition-colors"
                      title="Edit user"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleStatusToggle(user.id, user.status)}
                    className={`p-2 transition-colors ${
                      user.status === 'active'
                        ? 'text-gray-400 hover:text-red-600'
                        : 'text-gray-400 hover:text-green-600'
                    }`}
                    title={user.status === 'active' ? 'Block user' : 'Activate user'}
                  >
                    {user.status === 'active' ? (
                      <Ban className="w-4 h-4" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(user.id, user.name)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete user"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManager;
