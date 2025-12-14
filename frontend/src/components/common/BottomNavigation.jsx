import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Map, Star, Bell, User } from 'lucide-react';

const BottomNavigation = ({ role = 'passenger' }) => {
  const location = useLocation();

  const passengerLinks = [
    { to: '/passenger/home', icon: Home, label: 'Home' },
    { to: '/passenger/routes', icon: Map, label: 'Routes' },
    { to: '/passenger/favorites', icon: Star, label: 'Favorites' },
    { to: '/passenger/alerts', icon: Bell, label: 'Alerts' },
    { to: '/passenger/profile', icon: User, label: 'Profile' }
  ];

  const driverLinks = [
    { to: '/driver/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/driver/active-trip', icon: Map, label: 'Trip' },
    { to: '/driver/earnings', icon: Star, label: 'Earnings' },
    { to: '/driver/profile', icon: User, label: 'Profile' }
  ];

  const links = role === 'driver' ? driverLinks : passengerLinks;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40 lg:hidden">
      <div className="flex justify-around items-center h-16">
        {links.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
          
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
