import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HelmetProvider } from 'react-helmet-async';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { OfflineProvider } from './contexts/OfflineContext';

// Components
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/common/Layout';
import OfflineIndicator from './components/common/OfflineIndicator';

// Lazy loaded pages for better performance
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const VerifyPhone = lazy(() => import('./pages/auth/VerifyPhone'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));

// Passenger Pages
const PassengerHome = lazy(() => import('./pages/passenger/PassengerHome'));
const PassengerRoutes = lazy(() => import('./pages/passenger/Routes'));
const RouteView = lazy(() => import('./pages/passenger/RouteView'));
const TripDetails = lazy(() => import('./pages/passenger/TripDetails'));
const TrackMatatu = lazy(() => import('./pages/passenger/TrackMatatu'));
const Alerts = lazy(() => import('./pages/passenger/Alerts'));
const Profile = lazy(() => import('./pages/passenger/Profile'));
const Favorites = lazy(() => import('./pages/passenger/Favorites'));
const History = lazy(() => import('./pages/passenger/History'));
const Notifications = lazy(() => import('./pages/passenger/Notifications'));
const PassengerSettings = lazy(() => import('./pages/passenger/Settings'));

// Driver Pages
const DriverLogin = lazy(() => import('./pages/driver/DriverLogin'));
const DriverDashboard = lazy(() => import('./pages/driver/DriverDashboard'));
const ActiveTrip = lazy(() => import('./pages/driver/ActiveTrip'));
const DriverEarnings = lazy(() => import('./pages/driver/DriverEarnings'));
const DriverProfile = lazy(() => import('./pages/driver/DriverProfile'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const FleetManagement = lazy(() => import('./pages/admin/FleetManagement'));
const Analytics = lazy(() => import('./pages/admin/Analytics'));
const AdminDrivers = lazy(() => import('./pages/admin/AdminDrivers'));
const Communications = lazy(() => import('./pages/admin/Communications'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));

// Styles
import './styles/globals.css';
import './styles/MapboxOverrides.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <LanguageProvider>
            <ThemeProvider>
              <OfflineProvider>
                <Router>
                  <AuthProvider>
                    <SocketProvider>
                      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                        <Toaster
                          position="top-center"
                          toastOptions={{
                            duration: 4000,
                            style: {
                              background: '#333',
                              color: '#fff',
                            },
                            success: {
                              duration: 3000,
                              theme: {
                                primary: 'green',
                                secondary: 'black',
                              },
                            },
                          }}
                        />
                        
                        <OfflineIndicator />
                        
                        <Suspense fallback={<LoadingSpinner fullScreen />}>
                          <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Landing />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/verify-phone" element={<VerifyPhone />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            
                            {/* Passenger Routes */}
                            <Route path="/passenger" element={
                              <ProtectedRoute allowedRoles={['passenger']}>
                                <Layout showBottomNav>
                                  <PassengerHome />
                                </Layout>
                              </ProtectedRoute>
                            } />
                            <Route path="/passenger/routes" element={
                              <ProtectedRoute allowedRoles={['passenger']}>
                                <Layout showBottomNav>
                                  <PassengerRoutes />
                                </Layout>
                              </ProtectedRoute>
                            } />
                            <Route path="/route/:id" element={
                              <ProtectedRoute allowedRoles={['passenger']}>
                                <Layout showBottomNav>
                                  <RouteView />
                                </Layout>
                              </ProtectedRoute>
                            } />
                            <Route path="/trip/:id" element={
                              <ProtectedRoute allowedRoles={['passenger']}>
                                <Layout showBottomNav>
                                  <TripDetails />
                                </Layout>
                              </ProtectedRoute>
                            } />
                            <Route path="/passenger/track/:id" element={
                              <ProtectedRoute allowedRoles={['passenger']}>
                                <Layout showBottomNav>
                                  <TrackMatatu />
                                </Layout>
                              </ProtectedRoute>
                            } />
                            <Route path="/alerts" element={
                              <ProtectedRoute allowedRoles={['passenger']}>
                                <Layout showBottomNav>
                                  <Alerts />
                                </Layout>
                              </ProtectedRoute>
                            } />
                            <Route path="/profile" element={
                              <ProtectedRoute allowedRoles={['passenger']}>
                                <Layout showBottomNav>
                                  <Profile />
                                </Layout>
                              </ProtectedRoute>
                            } />
                            <Route path="/favorites" element={
                              <ProtectedRoute allowedRoles={['passenger']}>
                                <Layout showBottomNav>
                                  <Favorites />
                                </Layout>
                              </ProtectedRoute>
                            } />
                            <Route path="/passenger/history" element={
                              <ProtectedRoute allowedRoles={['passenger']}>
                                <Layout showBottomNav>
                                  <History />
                                </Layout>
                              </ProtectedRoute>
                            } />
                            <Route path="/passenger/notifications" element={
                              <ProtectedRoute allowedRoles={['passenger']}>
                                <Layout showBottomNav>
                                  <Notifications />
                                </Layout>
                              </ProtectedRoute>
                            } />
                            <Route path="/settings" element={
                              <ProtectedRoute allowedRoles={['passenger']}>
                                <Layout showBottomNav>
                                  <PassengerSettings />
                                </Layout>
                              </ProtectedRoute>
                            } />
                            
                            {/* Driver Routes */}
                            <Route path="/driver/login" element={<DriverLogin />} />
                            <Route path="/driver" element={
                              <ProtectedRoute allowedRoles={['driver']}>
                                <Layout>
                                  <DriverDashboard />
                                </Layout>
                              </ProtectedRoute>
                            } />
                            <Route path="/driver/trip/:id" element={
                              <ProtectedRoute allowedRoles={['driver']}>
                                <Layout>
                                  <ActiveTrip />
                                </Layout>
                              </ProtectedRoute>
                            } />
                            <Route path="/driver/earnings" element={
                              <ProtectedRoute allowedRoles={['driver']}>
                                <Layout>
                                  <DriverEarnings />
                                </Layout>
                              </ProtectedRoute>
                            } />
                            <Route path="/driver/profile" element={
                              <ProtectedRoute allowedRoles={['driver']}>
                                <Layout>
                                  <DriverProfile />
                                </Layout>
                              </ProtectedRoute>
                            } />
                            
                            {/* Admin Routes */}
                            <Route path="/admin" element={
                              <ProtectedRoute allowedRoles={['sacco_admin', 'super_admin']}>
                                <Layout>
                                  <AdminDashboard />
                                </Layout>
                              </ProtectedRoute>
                            } />
                            <Route path="/admin/fleet" element={
                              <ProtectedRoute allowedRoles={['sacco_admin', 'super_admin']}>
                                <Layout>
                                  <FleetManagement />
                                </Layout>
                              </ProtectedRoute>
                            } />
                            <Route path="/admin/analytics" element={
                              <ProtectedRoute allowedRoles={['sacco_admin', 'super_admin']}>
                                <Layout>
                                  <Analytics />
                                </Layout>
                              </ProtectedRoute>
                            } />
                            <Route path="/admin/drivers" element={
                              <ProtectedRoute allowedRoles={['sacco_admin', 'super_admin']}>
                                <Layout>
                                  <AdminDrivers />
                                </Layout>
                              </ProtectedRoute>
                            } />
                            <Route path="/admin/communications" element={
                              <ProtectedRoute allowedRoles={['sacco_admin', 'super_admin']}>
                                <Layout>
                                  <Communications />
                                </Layout>
                              </ProtectedRoute>
                            } />
                            <Route path="/admin/settings" element={
                              <ProtectedRoute allowedRoles={['sacco_admin', 'super_admin']}>
                                <Layout>
                                  <AdminSettings />
                                </Layout>
                              </ProtectedRoute>
                            } />
                            
                            {/* 404 */}
                            <Route path="*" element={
                              <div className="min-h-screen flex items-center justify-center">
                                <div className="text-center">
                                  <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">404</h1>
                                  <p className="text-gray-600 dark:text-gray-300 mb-8">Page not found</p>
                                  <a href="/" className="btn-primary">
                                    Go Home
                                  </a>
                                </div>
                              </div>
                            } />
                          </Routes>
                        </Suspense>
                        
                        <ReactQueryDevtools initialIsOpen={false} />
                      </div>
                    </SocketProvider>
                  </AuthProvider>
                </Router>
              </OfflineProvider>
            </ThemeProvider>
          </LanguageProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;