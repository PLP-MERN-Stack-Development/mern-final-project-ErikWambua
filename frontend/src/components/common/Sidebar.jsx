import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { X, User, Settings, Home, Star, Bell, History, UserCircle, LayoutDashboard, Truck, Users, TrendingUp, Car, DollarSign, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const Sidebar = ({ isOpen, onClose, user }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } lg:translate-x-0 flex flex-col overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-nairobi-blue to-blue-900">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-matatu-yellow rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-nairobi-blue">M</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              MatPulse254
            </h2>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-nairobi-blue to-blue-900 flex items-center justify-center text-white shadow-md">
                <span className="text-xl font-bold">{user.name?.charAt(0)?.toUpperCase()}</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {user.role.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {user?.role === 'passenger' && (
            <>
              <SidebarLink to="/passenger" icon={Home} label="Home" onClick={onClose} isActive={isActive('/passenger')} />
              <SidebarLink to="/favorites" icon={Star} label="Favorites" onClick={onClose} isActive={isActive('/favorites')} />
              <SidebarLink to="/passenger/notifications" icon={Bell} label="Notifications" onClick={onClose} isActive={isActive('/passenger/notifications')} />
              <SidebarLink to="/passenger/history" icon={History} label="History" onClick={onClose} isActive={isActive('/passenger/history')} />
              <SidebarLink to="/profile" icon={UserCircle} label="Profile" onClick={onClose} isActive={isActive('/profile')} />
            </>
          )}

          {user?.role === 'driver' && (
            <>
              <SidebarLink to="/driver" icon={LayoutDashboard} label="Dashboard" onClick={onClose} isActive={isActive('/driver')} />
              <SidebarLink to="/driver/active-trip" icon={Car} label="Active Trip" onClick={onClose} isActive={isActive('/driver/active-trip')} />
              <SidebarLink to="/driver/earnings" icon={DollarSign} label="Earnings" onClick={onClose} isActive={isActive('/driver/earnings')} />
              <SidebarLink to="/driver/profile" icon={UserCircle} label="Profile" onClick={onClose} isActive={isActive('/driver/profile')} />
            </>
          )}

          {(user?.role === 'sacco_admin' || user?.role === 'super_admin') && (
            <>
              <SidebarLink to="/admin" icon={LayoutDashboard} label="Dashboard" onClick={onClose} isActive={isActive('/admin')} />
              <SidebarLink to="/admin/fleet" icon={Truck} label="Fleet" onClick={onClose} isActive={isActive('/admin/fleet')} />
              <SidebarLink to="/admin/drivers" icon={Users} label="Drivers" onClick={onClose} isActive={isActive('/admin/drivers')} />
              <SidebarLink to="/admin/analytics" icon={TrendingUp} label="Analytics" onClick={onClose} isActive={isActive('/admin/analytics')} />
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <Link
            to={user?.role === 'passenger' ? '/settings' : '/admin/settings'}
            onClick={onClose}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              isActive('/settings') || isActive('/admin/settings')
                ? 'bg-nairobi-blue text-white shadow-md'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

const SidebarLink = ({ to, icon: Icon, label, onClick, isActive }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
      isActive
        ? 'bg-nairobi-blue text-white shadow-md'
        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-nairobi-blue dark:hover:text-blue-400'
    }`}
  >
    <Icon className="w-5 h-5 flex-shrink-0" />
    <span className="font-medium">{label}</span>
  </Link>
);

export default Sidebar;
