import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Edit2, Save, X, Camera, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    phone: user?.phone || '+254712345678',
    location: 'Nairobi, Kenya',
  });

  const [stats] = useState({
    totalTrips: 127,
    favoriteRoutes: 5,
    totalSpent: 15400,
    memberSince: 'Jan 2024',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Implement update profile API
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || 'John Doe',
      email: user?.email || 'john.doe@example.com',
      phone: user?.phone || '+254712345678',
      location: 'Nairobi, Kenya',
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-nairobi-blue to-blue-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-blue-100 mt-1">Manage your account information</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-nairobi-blue to-blue-900 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {formData.name.charAt(0)}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800">
                  <Camera className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{formData.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">Passenger</p>
              </div>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-nairobi-blue text-white rounded-lg hover:bg-blue-900 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-nairobi-blue text-white rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save
                </button>
              </div>
            )}
          </div>

          {/* Profile Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-nairobi-blue dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-nairobi-blue dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-nairobi-blue dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-nairobi-blue dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center">
            <p className="text-2xl font-bold text-nairobi-blue dark:text-blue-400">{stats.totalTrips}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Trips</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center">
            <p className="text-2xl font-bold text-matatu-yellow dark:text-yellow-400">{stats.favoriteRoutes}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Favorites</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center">
            <p className="text-2xl font-bold text-matatu-green dark:text-green-400">KES {stats.totalSpent.toLocaleString()}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Spent</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.memberSince}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Member Since</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/passenger/history')}
              className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <p className="font-semibold text-gray-900 dark:text-white">Trip History</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">View all your past trips</p>
            </button>
            <button
              onClick={() => navigate('/passenger/favorites')}
              className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <p className="font-semibold text-gray-900 dark:text-white">Favorite Routes</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage your saved routes</p>
            </button>
            <button
              onClick={() => navigate('/passenger/settings')}
              className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <p className="font-semibold text-gray-900 dark:text-white">Settings</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Customize your preferences</p>
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <LogOut className="w-5 h-5" />
                <p className="font-semibold">Logout</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
