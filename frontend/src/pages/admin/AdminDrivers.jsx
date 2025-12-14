import React, { useState } from 'react';
import { Users, Search, Plus, Phone, Mail, Star, Ban, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDrivers = () => {
  const [drivers, setDrivers] = useState([
    { id: 1, name: 'James Kamau', phone: '+254798765432', email: 'james@email.com', vehicle: 'KCA 123A', status: 'active', rating: 4.8, trips: 450, earnings: 675000 },
    { id: 2, name: 'Mary Wanjiru', phone: '+254787654321', email: 'mary@email.com', vehicle: 'KCB 456B', status: 'active', rating: 4.9, trips: 380, earnings: 570000 },
    { id: 3, name: 'John Mwangi', phone: '+254776543210', email: 'john@email.com', vehicle: 'KCD 012D', status: 'active', rating: 4.7, trips: 610, earnings: 915000 },
    { id: 4, name: 'Grace Njeri', phone: '+254765432109', email: 'grace@email.com', vehicle: null, status: 'inactive', rating: 4.6, trips: 290, earnings: 435000 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.phone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || driver.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusToggle = (id) => {
    setDrivers(drivers.map(driver => 
      driver.id === id 
        ? { ...driver, status: driver.status === 'active' ? 'inactive' : 'active' }
        : driver
    ));
    toast.success('Driver status updated');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Drivers</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your driver workforce</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Drivers</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{drivers.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
            {drivers.filter(d => d.status === 'active').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</p>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">
            {(drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length).toFixed(1)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</p>
          <p className="text-3xl font-bold text-nairobi-blue dark:text-blue-400 mt-2">
            {(drivers.reduce((sum, d) => sum + d.earnings, 0) / 1000000).toFixed(1)}M
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-nairobi-blue dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-nairobi-blue dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button className="flex items-center gap-2 bg-nairobi-blue text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors shadow-lg">
              <Plus className="w-5 h-5" />
              Add Driver
            </button>
          </div>
        </div>
      </div>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDrivers.map((driver) => (
          <div key={driver.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="bg-nairobi-blue w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {driver.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{driver.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{driver.rating}</span>
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                driver.status === 'active'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
              }`}>
                {driver.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4" />
                {driver.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4" />
                {driver.email}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Vehicle</p>
                <p className="font-semibold text-gray-900 dark:text-white">{driver.vehicle || 'None'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Trips</p>
                <p className="font-semibold text-gray-900 dark:text-white">{driver.trips}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Earnings</p>
                <p className="font-semibold text-gray-900 dark:text-white">{(driver.earnings / 1000).toFixed(0)}K</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleStatusToggle(driver.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  driver.status === 'active'
                    ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                }`}
              >
                {driver.status === 'active' ? (
                  <><Ban className="w-4 h-4" /> Suspend</>
                ) : (
                  <><CheckCircle className="w-4 h-4" /> Activate</>
                )}
              </button>
              <button className="px-4 py-2 bg-nairobi-blue text-white rounded-lg hover:bg-blue-900 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDrivers;
