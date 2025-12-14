// Application settings and configuration

// Core App Settings
export const APP_CONFIG = {
  appName: 'MatPulse254',
  fullName: 'MatPulse254 - Real-Time Matatu Tracking',
  version: '1.0.0',
  description: 'Real-time matatu tracking and booking platform for Nairobi',
  author: 'MatPulse254 Team',
  website: 'https://matpulse254.co.ke',
  supportEmail: 'support@matpulse254.co.ke',
};

// API Configuration
export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
};

// Language Settings
export const LANGUAGE_CONFIG = {
  defaultLanguage: 'en',
  supportedLanguages: [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
  ],
  fallbackLanguage: 'en',
};

// Theme Settings
export const THEME_CONFIG = {
  defaultTheme: 'light',
  themes: ['light', 'dark'],
  colors: {
    primary: '#1E40AF', // nairobi-blue
    secondary: '#F7B731', // matatu-yellow
    accent: '#10B981', // matatu-green
    danger: '#EF4444',
    warning: '#F59E0B',
    success: '#10B981',
    info: '#3B82F6',
  },
};

// Map Settings
export const MAP_CONFIG = {
  defaultCenter: [-1.2921, 36.8219], // Nairobi
  defaultZoom: 12,
  maxZoom: 18,
  minZoom: 10,
  updateInterval: 5000, // 5 seconds
  markerUpdateThreshold: 100, // meters
};

// Notification Settings
export const NOTIFICATION_CONFIG = {
  duration: 4000, // 4 seconds
  position: 'top-right',
  maxNotifications: 3,
  enableSound: true,
  enableVibration: true,
};

// Offline Settings
export const OFFLINE_CONFIG = {
  enableOfflineMode: true,
  cacheExpiry: 86400000, // 24 hours in milliseconds
  maxCacheSize: 50 * 1024 * 1024, // 50MB
  syncInterval: 60000, // 1 minute
};

// Socket Settings
export const SOCKET_CONFIG = {
  url: process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000',
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
  timeout: 10000,
};

// Geolocation Settings
export const GEOLOCATION_CONFIG = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
  watchInterval: 5000, // Update every 5 seconds
};

// Trip Settings
export const TRIP_CONFIG = {
  maxPassengers: 14, // Standard matatu capacity
  etaUpdateInterval: 30000, // 30 seconds
  arrivalThreshold: 50, // meters
  departureThreshold: 100, // meters
  maxWaitTime: 30, // minutes
};

// Payment Settings
export const PAYMENT_CONFIG = {
  currency: 'KES',
  minAmount: 10,
  maxAmount: 10000,
  methods: ['mpesa', 'cash'],
  defaultMethod: 'mpesa',
};

// Search Settings
export const SEARCH_CONFIG = {
  debounceDelay: 300, // milliseconds
  minSearchLength: 2,
  maxResults: 10,
  recentSearches: 5,
};

// Pagination Settings
export const PAGINATION_CONFIG = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50],
  maxPageSize: 100,
};

// File Upload Settings
export const UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
  maxFiles: 5,
};

// Date/Time Settings
export const DATETIME_CONFIG = {
  dateFormat: 'MMM DD, YYYY',
  timeFormat: 'HH:mm',
  dateTimeFormat: 'MMM DD, YYYY HH:mm',
  timezone: 'Africa/Nairobi',
  locale: 'en-KE',
};

// Feature Flags
export const FEATURE_FLAGS = {
  enableReservations: true,
  enableFavorites: true,
  enableAlerts: true,
  enableRatings: true,
  enableChat: false, // Coming soon
  enablePayments: true,
  enableAnalytics: true,
  enablePWA: true,
};

// Performance Settings
export const PERFORMANCE_CONFIG = {
  enableLazyLoading: true,
  enableCodeSplitting: true,
  enableServiceWorker: true,
  imageOptimization: true,
};

// Development Settings
export const DEV_CONFIG = {
  enableDebugMode: process.env.NODE_ENV === 'development',
  enableLogger: process.env.NODE_ENV === 'development',
  showDevTools: process.env.NODE_ENV === 'development',
};

// Export all settings as default
const settings = {
  app: APP_CONFIG,
  api: API_CONFIG,
  language: LANGUAGE_CONFIG,
  theme: THEME_CONFIG,
  map: MAP_CONFIG,
  notification: NOTIFICATION_CONFIG,
  offline: OFFLINE_CONFIG,
  socket: SOCKET_CONFIG,
  geolocation: GEOLOCATION_CONFIG,
  trip: TRIP_CONFIG,
  payment: PAYMENT_CONFIG,
  search: SEARCH_CONFIG,
  pagination: PAGINATION_CONFIG,
  upload: UPLOAD_CONFIG,
  datetime: DATETIME_CONFIG,
  features: FEATURE_FLAGS,
  performance: PERFORMANCE_CONFIG,
  dev: DEV_CONFIG,
};

export default settings;
