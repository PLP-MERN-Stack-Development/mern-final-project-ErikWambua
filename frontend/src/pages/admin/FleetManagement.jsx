import React, { useState } from 'react';
import { Car, Plus, Search, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const FleetManagement = () => {
  const [vehicles, setVehicles] = useState([
    { id: 1, registration: 'KCA 123A', model: 'Toyota Hiace', capacity: 14, status: 'active', driver: 'James Kamau', trips: 450, revenue: 675000 },
    { id: 2, registration: 'KCB 456B', model: 'Nissan Caravan', capacity: 14, status: 'active', driver: 'Mary Wanjiru', trips: 380, revenue: 550000 },
    { id: 3, registration: 'KCC 789C', model: 'Toyota Hiace', capacity: 14, status: 'maintenance', driver: null, trips: 520, revenue: 780000 },
    { id: 4, registration: 'KCD 012D', model: 'Isuzu Elf', capacity: 25, status: 'active', driver: 'John Mwangi', trips: 610, revenue: 915000 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || vehicle.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      setVehicles(vehicles.filter(v => v.id !== id));
      toast.success('Vehicle deleted successfully');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Fleet Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your vehicle fleet</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Vehicles</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{vehicles.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
            {vehicles.filter(v => v.status === 'active').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Maintenance</p>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">
            {vehicles.filter(v => v.status === 'maintenance').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Utilization</p>
          <p className="text-3xl font-bold text-nairobi-blue dark:text-blue-400 mt-2">
            {Math.round((vehicles.filter(v => v.status === 'active').length / vehicles.length) * 100)}%
          </p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by registration or model..."
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
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-nairobi-blue text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Vehicle
            </button>
          </div>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Registration</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Model</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Capacity</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Driver</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Trips</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Revenue</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 dark:bg-blue-900 w-10 h-10 rounded-lg flex items-center justify-center">
                        <Car className="w-5 h-5 text-nairobi-blue dark:text-blue-400" />
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">{vehicle.registration}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{vehicle.model}</td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{vehicle.capacity}</td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{vehicle.driver || 'Unassigned'}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      vehicle.status === 'active' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : vehicle.status === 'maintenance'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {vehicle.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{vehicle.trips}</td>
                  <td className="py-4 px-6 text-gray-900 dark:text-white font-semibold">
                    KES {vehicle.revenue.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(vehicle.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FleetManagement;
