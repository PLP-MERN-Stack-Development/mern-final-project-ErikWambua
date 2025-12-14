import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from './Sidebar';
import BottomNavigation from './BottomNavigation';
import OfflineIndicator from './OfflineIndicator';

const Layout = ({ children, showBottomNav: forceShowBottomNav }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  // Routes that don't need layout (auth pages)
  const noLayoutRoutes = ['/login', '/register', '/verify-phone', '/forgot-password', '/reset-password'];
  const isAuthPage = noLayoutRoutes.some(route => location.pathname.startsWith(route));

  // Public routes that don't need navigation
  const publicRoutes = ['/', '/about', '/contact', '/privacy', '/terms'];
  const isPublicPage = publicRoutes.includes(location.pathname);

  // Show bottom navigation only on mobile for logged-in users
  const showBottomNav = forceShowBottomNav || (user && !isAuthPage && window.innerWidth < 768);

  // Show sidebar only for logged-in users on desktop
  const showSidebar = user && !isAuthPage && window.innerWidth >= 768;

  if (isAuthPage) {
    // Auth pages get no layout - just the page content
    return (
      <>
        <OfflineIndicator />
        {children || <Outlet />}
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <OfflineIndicator />
      
      {/* Sidebar for desktop - Fixed position */}
      {user && !isAuthPage && (
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} user={user} />
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        {/* Header for mobile */}
        {user && !isPublicPage && (
          <header className="lg:hidden sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex items-center justify-between px-4 py-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Open menu"
              >
                <svg
                  className="w-6 h-6 text-gray-600 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                MatPulse254
              </h1>
              <div className="w-10" /> {/* Spacer for centering */}
            </div>
          </header>
        )}

        {/* Page content */}
        <main className={`flex-1 ${showBottomNav ? 'pb-16' : ''}`}>
          {children || <Outlet />}
        </main>
      </div>

      {/* Bottom navigation for mobile */}
      {showBottomNav && <BottomNavigation />}
    </div>
  );
};

export default Layout;
