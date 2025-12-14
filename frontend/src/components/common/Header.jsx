import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  MapPin, 
  Bell, 
  User, 
  LogOut, 
  Moon, 
  Sun,
  Globe,
  Search
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotification } from '../../hooks/useNotification';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout, isPassenger, isDriver, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, switchLanguage, t } = useLanguage();
  const { permission, requestPermission } = useNotification();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNotificationClick = async () => {
    if (permission !== 'granted') {
      await requestPermission();
    }
    setShowNotifications(!showNotifications);
  };

  const getRoleBasedLinks = () => {
    if (isPassenger) {
      return [
        { to: '/passenger', label: t('home'), icon: '🏠' },
        { to: '/favorites', label: t('favorites'), icon: '⭐' },
        { to: '/alerts', label: t('alerts'), icon: '⚠️' },
        { to: '/profile', label: t('profile'), icon: '👤' },
      ];
    }
    if (isDriver) {
      return [
        { to: '/driver', label: t('home'), icon: '🚗' },
        { to: '/driver/earnings', label: t('earnings'), icon: '💰' },
        { to: '/driver/profile', label: t('profile'), icon: '👤' },
      ];
    }
    if (isAdmin) {
      return [
        { to: '/admin', label: 'Dashboard', icon: '📊' },
        { to: '/admin/fleet', label: 'Fleet', icon: '🚌' },
        { to: '/admin/drivers', label: 'Drivers', icon: '👨‍✈️' },
        { to: '/admin/analytics', label: 'Analytics', icon: '📈' },
      ];
    }
    return [];
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 mr-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-kenyan-green to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Matatu<span className="text-kenyan-green">Tracker</span>
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {language === 'sw' ? 'Ufuatiliaji wa Matatu' : 'Real-time Matatu Tracking'}
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {getRoleBasedLinks().map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <span>{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
            
            {user && (
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200 dark:border-gray-800">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-kenyan-green rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.role === 'passenger' ? 'Passenger' : 
                       user.role === 'driver' ? 'Driver' : 'Admin'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Search Button (Mobile) */}
            <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <Search size={20} />
            </button>

            {/* Notifications */}
            {user && (
              <button
                onClick={handleNotificationClick}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => switchLanguage(language === 'en' ? 'sw' : 'en')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Globe size={20} />
              <span className="text-xs ml-1">{language === 'en' ? 'SW' : 'EN'}</span>
            </button>

            {/* Auth Buttons */}
            {!user ? (
              <div className="hidden lg:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-kenyan-green"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="btn-primary px-4 py-2 text-sm"
                >
                  {t('sign_up')}
                </Link>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="hidden lg:flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <LogOut size={20} />
                <span className="font-medium">{t('logout')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col space-y-2">
              {getRoleBasedLinks().map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
              
              {user && (
                <>
                  <div className="border-t border-gray-200 dark:border-gray-800 my-2 pt-2">
                    <div className="flex items-center space-x-3 px-4 py-3">
                      <div className="w-10 h-10 bg-kenyan-green rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {user.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-red-600"
                  >
                    <LogOut size={20} />
                    <span className="font-medium">{t('logout')}</span>
                  </button>
                </>
              )}
              
              {!user && (
                <div className="flex flex-col space-y-2 px-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <Link
                    to="/login"
                    className="btn-outline py-3 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('login')}
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary py-3 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('sign_up')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="absolute right-4 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {t('notifications')}
              </h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {/* Sample notifications */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-300">🚌</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      Route 111 - Githurai to CBD
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your matatu is 5 minutes away
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      10 min ago
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 dark:text-yellow-300">⚠️</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      Traffic Alert
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Heavy traffic near Kasarani
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      30 min ago
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-300">💰</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      Payment Confirmed
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      KES 50 for seat reservation
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      2 hours ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <Link
                to="/notifications"
                className="text-sm text-kenyan-green font-medium hover:underline text-center block"
                onClick={() => setShowNotifications(false)}
              >
                View all notifications
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;