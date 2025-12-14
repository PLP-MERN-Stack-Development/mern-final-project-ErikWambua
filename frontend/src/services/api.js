import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add timestamp to prevent caching
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 errors (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post('/api/auth/refresh', {
            refresh_token: refreshToken
          });
          
          const { token, refresh_token } = response.data;
          
          localStorage.setItem('token', token);
          localStorage.setItem('refresh_token', refresh_token);
          
          // Update authorization header
          originalRequest.headers.Authorization = `Bearer ${token}`;
          
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, log out user
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('token_expiry');
        
        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          toast.error(data.message || 'Bad request');
          break;
        case 403:
          toast.error('You do not have permission to perform this action');
          break;
        case 404:
          toast.error('Resource not found');
          break;
        case 429:
          toast.error('Too many requests. Please try again later.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(data.message || 'An error occurred');
      }
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection.');
    } else {
      // Request setup error
      toast.error('Request error. Please try again.');
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
const endpoints = {
  // Auth
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    verifyPhone: (code) => api.post('/auth/verify-phone', { code }),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
    changePassword: (data) => api.post('/auth/change-password', data),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
    logout: () => api.post('/auth/logout'),
  },
  
  // Passenger
  passenger: {
    getRoutes: (params) => api.get('/passenger/routes', { params }),
    getRoute: (id) => api.get(`/passenger/routes/${id}`),
    getTrips: (params) => api.get('/passenger/trips', { params }),
    getTrip: (id) => api.get(`/passenger/trips/${id}`),
    reserveSeat: (data) => api.post('/passenger/reserve', data),
    cancelReservation: (id) => api.delete(`/passenger/reserve/${id}`),
    getReservations: () => api.get('/passenger/reservations'),
    getFavorites: () => api.get('/passenger/favorites'),
    addFavorite: (data) => api.post('/passenger/favorites', data),
    removeFavorite: (id) => api.delete(`/passenger/favorites/${id}`),
    getHistory: (params) => api.get('/passenger/history', { params }),
    searchRoutes: (query) => api.get(`/passenger/search?q=${query}`),
  },
  
  // Driver
  driver: {
    startTrip: (data) => api.post('/driver/trips/start', data),
    updateTrip: (id, data) => api.put(`/driver/trips/${id}`, data),
    endTrip: (id) => api.post(`/driver/trips/${id}/end`),
    getActiveTrip: () => api.get('/driver/trips/active'),
    getTrips: (params) => api.get('/driver/trips', { params }),
    getEarnings: (params) => api.get('/driver/earnings', { params }),
    requestWithdrawal: (amount) => api.post('/driver/withdraw', { amount }),
    getWithdrawals: () => api.get('/driver/withdrawals'),
    updateLocation: (data) => api.post('/driver/location', data),
    updateStatus: (status) => api.post('/driver/status', { status }),
    getVehicle: () => api.get('/driver/vehicle'),
    updateVehicle: (data) => api.put('/driver/vehicle', data),
  },
  
  // Admin
  admin: {
    getDashboard: () => api.get('/admin/dashboard'),
    getFleet: (params) => api.get('/admin/fleet', { params }),
    updateVehicle: (id, data) => api.put(`/admin/fleet/${id}`, data),
    getDrivers: (params) => api.get('/admin/drivers', { params }),
    updateDriver: (id, data) => api.put(`/admin/drivers/${id}`, data),
    getRevenue: (params) => api.get('/admin/revenue', { params }),
    getAnalytics: (params) => api.get('/admin/analytics', { params }),
    sendAnnouncement: (data) => api.post('/admin/announcements', data),
    getAnnouncements: () => api.get('/admin/announcements'),
    getReports: (params) => api.get('/admin/reports', { params }),
    exportData: (type) => api.get(`/admin/export/${type}`, { responseType: 'blob' }),
  },
  
  // Alerts
  alerts: {
    report: (data) => api.post('/alerts', data),
    getAlerts: (params) => api.get('/alerts', { params }),
    verifyAlert: (id) => api.post(`/alerts/${id}/verify`),
    getNearbyAlerts: (params) => api.get('/alerts/nearby', { params }),
  },
  
  // M-Pesa
  mpesa: {
    stkPush: (data) => api.post('/mpesa/stk-push', data),
    queryStatus: (checkoutRequestId) => api.post('/mpesa/query', { checkoutRequestId }),
    getTransactions: () => api.get('/mpesa/transactions'),
  },
  
  // Map
  map: {
    geocode: (query) => api.get(`/map/geocode?q=${query}`),
    reverseGeocode: (lat, lng) => api.get(`/map/reverse-geocode?lat=${lat}&lng=${lng}`),
    getDirections: (from, to) => api.get(`/map/directions?from=${from}&to=${to}`),
    searchPlaces: (query, location) => api.get(`/map/search?q=${query}&lat=${location.lat}&lng=${location.lng}`),
  },
};

// Custom hooks for React Query
const queryKeys = {
  auth: ['auth'],
  profile: ['profile'],
  routes: (params) => ['routes', params],
  route: (id) => ['route', id],
  trips: (params) => ['trips', params],
  trip: (id) => ['trip', id],
  favorites: ['favorites'],
  alerts: (params) => ['alerts', params],
  driverTrips: (params) => ['driver', 'trips', params],
  driverEarnings: (params) => ['driver', 'earnings', params],
  fleet: (params) => ['admin', 'fleet', params],
  revenue: (params) => ['admin', 'revenue', params],
  drivers: (params) => ['admin', 'drivers', params],
};

// Utility functions
const utils = {
  // Format phone number for display
  formatPhone: (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('254')) {
      return `0${cleaned.substring(3)}`;
    }
    return phone;
  },
  
  // Format phone number for API
  formatPhoneForApi: (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      return `254${cleaned.substring(1)}`;
    }
    if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
      return `254${cleaned}`;
    }
    return cleaned;
  },
  
  // Format currency
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  },
  
  // Format distance
  formatDistance: (meters) => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  },
  
  // Format duration
  formatDuration: (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  },
  
  // Calculate ETA
  calculateETA: (distance, speed = 30) => {
    // distance in km, speed in km/h
    const hours = distance / speed;
    const minutes = Math.round(hours * 60);
    return minutes;
  },
  
  // Debounce function
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // Throttle function
  throttle: (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  // Generate random color
  getRandomColor: () => {
    const colors = [
      '#006600', '#ED1C24', '#1E40AF', '#F7B731', '#10B981',
      '#8B5CF6', '#EC4899', '#0EA5E9', '#84CC16', '#F59E0B'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  },
  
  // Validate Kenyan phone number
  isValidPhone: (phone) => {
    const regex = /^(?:254|\+254|0)?(7(?:(?:[0-9][0-9])|(?:0[0-8])|(4[0-1]))[0-9]{6})$/;
    return regex.test(phone);
  },
};

export { api, endpoints, queryKeys, utils };
export default api;