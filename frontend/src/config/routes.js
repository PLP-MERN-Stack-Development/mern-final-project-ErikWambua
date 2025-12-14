// Routes configuration for MatPulse254

// Public Routes
export const PUBLIC_ROUTES = {
  LANDING: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  NOT_FOUND: '/404',
};

// Auth Routes
export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_PHONE: '/verify-phone',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DRIVER_LOGIN: '/driver/login',
};

// Passenger Routes
export const PASSENGER_ROUTES = {
  HOME: '/passenger/home',
  ROUTE_VIEW: '/passenger/route/:routeId',
  TRIP_DETAILS: '/passenger/trip/:tripId',
  PROFILE: '/passenger/profile',
  FAVORITES: '/passenger/favorites',
  NOTIFICATIONS: '/passenger/notifications',
  ALERTS: '/passenger/alerts',
  SETTINGS: '/passenger/settings',
  HISTORY: '/passenger/history',
};

// Driver Routes
export const DRIVER_ROUTES = {
  DASHBOARD: '/driver/dashboard',
  ACTIVE_TRIP: '/driver/active-trip',
  EARNINGS: '/driver/earnings',
  PROFILE: '/driver/profile',
  SETTINGS: '/driver/settings',
  HISTORY: '/driver/history',
};

// Admin Routes
export const ADMIN_ROUTES = {
  DASHBOARD: '/admin/dashboard',
  FLEET: '/admin/fleet',
  ANALYTICS: '/admin/analytics',
  DRIVERS: '/admin/drivers',
  COMMUNICATIONS: '/admin/communications',
  SETTINGS: '/admin/settings',
};

// API Routes (relative to base URL)
export const API_ROUTES = {
  // Auth
  AUTH_LOGIN: '/api/auth/login',
  AUTH_REGISTER: '/api/auth/register',
  AUTH_VERIFY: '/api/auth/verify-phone',
  AUTH_REFRESH: '/api/auth/refresh',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_FORGOT_PASSWORD: '/api/auth/forgot-password',
  AUTH_RESET_PASSWORD: '/api/auth/reset-password',

  // Passenger
  PASSENGER_ROUTES: '/api/passenger/routes',
  PASSENGER_TRIPS: '/api/passenger/trips',
  PASSENGER_FAVORITES: '/api/passenger/favorites',
  PASSENGER_ALERTS: '/api/passenger/alerts',
  PASSENGER_NOTIFICATIONS: '/api/passenger/notifications',
  PASSENGER_PROFILE: '/api/passenger/profile',
  PASSENGER_HISTORY: '/api/passenger/history',
  PASSENGER_RESERVATIONS: '/api/passenger/reservations',

  // Driver
  DRIVER_TRIPS: '/api/driver/trips',
  DRIVER_EARNINGS: '/api/driver/earnings',
  DRIVER_PROFILE: '/api/driver/profile',
  DRIVER_VEHICLE: '/api/driver/vehicle',
  DRIVER_ROUTE: '/api/driver/route',
  DRIVER_STATUS: '/api/driver/status',
  DRIVER_LOCATION: '/api/driver/location',

  // Sacco/Admin
  SACCO_DASHBOARD: '/api/sacco/dashboard',
  SACCO_FLEET: '/api/sacco/fleet',
  SACCO_DRIVERS: '/api/sacco/drivers',
  SACCO_ANALYTICS: '/api/sacco/analytics',
  SACCO_ROUTES: '/api/sacco/routes',
  SACCO_VEHICLES: '/api/sacco/vehicles',

  // Trips
  TRIPS: '/api/trips',
  TRIP_DETAILS: '/api/trips/:id',
  TRIP_ETA: '/api/trips/:id/eta',
  TRIP_CAPACITY: '/api/trips/:id/capacity',

  // Payments
  PAYMENTS: '/api/payments',
  PAYMENT_MPESA: '/api/payments/mpesa',
  PAYMENT_STATUS: '/api/payments/:id/status',

  // General
  ROUTES: '/api/routes',
  STAGES: '/api/stages',
  VEHICLES: '/api/vehicles',
  NOTIFICATIONS: '/api/notifications',
};

// Route Patterns (for matching)
export const ROUTE_PATTERNS = {
  PASSENGER: /^\/passenger/,
  DRIVER: /^\/driver/,
  ADMIN: /^\/admin/,
  AUTH: /^\/(login|register|verify-phone|forgot-password|reset-password)/,
  PUBLIC: /^\/(about|contact|privacy|terms|$)/,
};

// Route Helpers
export const buildRoute = (path, params = {}) => {
  let route = path;
  Object.entries(params).forEach(([key, value]) => {
    route = route.replace(`:${key}`, value);
  });
  return route;
};

export const isPublicRoute = (path) => {
  return ROUTE_PATTERNS.PUBLIC.test(path);
};

export const isAuthRoute = (path) => {
  return ROUTE_PATTERNS.AUTH.test(path);
};

export const isProtectedRoute = (path) => {
  return (
    ROUTE_PATTERNS.PASSENGER.test(path) ||
    ROUTE_PATTERNS.DRIVER.test(path) ||
    ROUTE_PATTERNS.ADMIN.test(path)
  );
};

export const getUserRoleFromPath = (path) => {
  if (ROUTE_PATTERNS.PASSENGER.test(path)) return 'passenger';
  if (ROUTE_PATTERNS.DRIVER.test(path)) return 'driver';
  if (ROUTE_PATTERNS.ADMIN.test(path)) return 'sacco_admin';
  return null;
};

export const getDefaultRouteForRole = (role) => {
  const roleRoutes = {
    passenger: PASSENGER_ROUTES.HOME,
    driver: DRIVER_ROUTES.DASHBOARD,
    sacco_admin: ADMIN_ROUTES.DASHBOARD,
  };
  return roleRoutes[role] || PUBLIC_ROUTES.LANDING;
};

// Main Routes Configuration Object
export const routes = {
  public: PUBLIC_ROUTES,
  auth: AUTH_ROUTES,
  passenger: PASSENGER_ROUTES,
  driver: DRIVER_ROUTES,
  admin: ADMIN_ROUTES,
  api: API_ROUTES,
  patterns: ROUTE_PATTERNS,
  helpers: {
    buildRoute,
    isPublicRoute,
    isAuthRoute,
    isProtectedRoute,
    getUserRoleFromPath,
    getDefaultRouteForRole,
  },
};

export default routes;
