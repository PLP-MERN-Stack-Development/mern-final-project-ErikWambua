// Application Constants

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
export const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

// User Roles
export const ROLES = {
  PASSENGER: 'passenger',
  DRIVER: 'driver',
  SACCO_ADMIN: 'sacco_admin',
  SUPER_ADMIN: 'super_admin'
};

// Trip Status
export const TRIP_STATUS = {
  SCHEDULED: 'scheduled',
  BOARDING: 'boarding',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Crowd Levels
export const CROWD_LEVELS = {
  EMPTY: 'empty',
  LOW: 'low',
  HALF: 'half',
  HIGH: 'high',
  FULL: 'full',
  STANDING: 'standing'
};

// Crowd Level Colors
export const CROWD_COLORS = {
  empty: '#10B981', // green
  low: '#3B82F6',   // blue
  half: '#F59E0B',  // yellow
  high: '#F97316',  // orange
  full: '#EF4444',  // red
  standing: '#7C2D12' // dark red
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// Alert Types
export const ALERT_TYPES = {
  TRAFFIC: 'traffic',
  ACCIDENT: 'accident',
  ROADBLOCK: 'roadblock',
  SECURITY: 'security',
  WEATHER: 'weather',
  GENERAL: 'general'
};

// Alert Severity
export const ALERT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Map Settings
export const MAP_SETTINGS = {
  DEFAULT_CENTER: [36.8219, -1.2921], // Nairobi
  DEFAULT_ZOOM: 13,
  MIN_ZOOM: 10,
  MAX_ZOOM: 18,
  PITCH: 0,
  BEARING: 0
};

// Map Styles
export const MAP_STYLES = {
  STREETS: 'mapbox://styles/mapbox/streets-v12',
  OUTDOORS: 'mapbox://styles/mapbox/outdoors-v12',
  LIGHT: 'mapbox://styles/mapbox/light-v11',
  DARK: 'mapbox://styles/mapbox/dark-v11',
  SATELLITE: 'mapbox://styles/mapbox/satellite-v9',
  SATELLITE_STREETS: 'mapbox://styles/mapbox/satellite-streets-v12'
};

// Update Intervals (milliseconds)
export const UPDATE_INTERVALS = {
  LOCATION: 5000, // 5 seconds
  ETA: 30000,     // 30 seconds
  TRIP_LIST: 60000, // 1 minute
  ANALYTICS: 300000 // 5 minutes
};

// Distance thresholds (meters)
export const DISTANCE_THRESHOLDS = {
  NEARBY: 100,
  APPROACHING: 500,
  VISIBLE: 2000
};

// Socket Events
export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  
  // Trip events
  TRIP_UPDATE: 'trip:update',
  TRIP_LOCATION_UPDATE: 'trip:location:update',
  TRIP_STATUS_CHANGE: 'trip:status:change',
  TRIP_CROWD_UPDATE: 'trip:crowd:update',
  TRIP_INCIDENT_REPORTED: 'trip:incident:reported',
  
  // Join/Leave rooms
  JOIN_TRIP: 'join:trip',
  LEAVE_TRIP: 'leave:trip',
  JOIN_ROUTE: 'join:route',
  LEAVE_ROUTE: 'leave:route',
  
  // Alerts
  ALERT_NEW: 'alert:new',
  ALERT_UPDATE: 'alert:update',
  
  // Notifications
  NOTIFICATION_NEW: 'notification:new'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  THEME: 'theme',
  LANGUAGE: 'language',
  FAVORITES: 'favorites',
  RECENT_SEARCHES: 'recentSearches',
  MAP_STYLE: 'mapStyle',
  NOTIFICATIONS_ENABLED: 'notificationsEnabled'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png']
};

// Date Formats (date-fns format)
export const DATE_FORMATS = {
  FULL: 'MMMM dd, yyyy hh:mm a',
  SHORT: 'MMM dd, yyyy',
  TIME: 'hh:mm a',
  DATE_TIME: 'dd/MM/yyyy HH:mm'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  LOCATION_ERROR: 'Unable to access your location.',
  GENERIC_ERROR: 'Something went wrong. Please try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  LOGOUT: 'Logout successful!',
  REGISTER: 'Registration successful!',
  UPDATE: 'Updated successfully!',
  DELETE: 'Deleted successfully!',
  SAVE: 'Saved successfully!'
};

// Validation Rules
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  PHONE_REGEX: /^(\+?254|0)[17]\d{8}$/, // Kenyan phone number
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

// Colors
export const COLORS = {
  PRIMARY: '#2563EB',
  SECONDARY: '#10B981',
  DANGER: '#EF4444',
  WARNING: '#F59E0B',
  INFO: '#3B82F6',
  SUCCESS: '#10B981'
};

// Weather Conditions
export const WEATHER_CONDITIONS = {
  CLEAR: 'clear',
  RAIN: 'rain',
  FOG: 'fog',
  HAZE: 'haze',
  STORM: 'storm'
};

// Traffic Conditions
export const TRAFFIC_CONDITIONS = {
  CLEAR: 'clear',
  MODERATE: 'moderate',
  HEAVY: 'heavy',
  GRIDLOCK: 'gridlock'
};

export default {
  API_BASE_URL,
  SOCKET_URL,
  MAPBOX_TOKEN,
  ROLES,
  TRIP_STATUS,
  CROWD_LEVELS,
  CROWD_COLORS,
  PAYMENT_STATUS,
  ALERT_TYPES,
  ALERT_SEVERITY,
  MAP_SETTINGS,
  MAP_STYLES,
  UPDATE_INTERVALS,
  DISTANCE_THRESHOLDS,
  SOCKET_EVENTS,
  STORAGE_KEYS,
  PAGINATION,
  FILE_UPLOAD,
  DATE_FORMATS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION,
  COLORS,
  WEATHER_CONDITIONS,
  TRAFFIC_CONDITIONS
};
