// Geolocation Service for managing location tracking

class GeolocationService {
  constructor() {
    this.watchId = null;
    this.currentPosition = null;
    this.listeners = [];
    this.options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };
  }

  // Get current position
  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentPosition = this.formatPosition(position);
          resolve(this.currentPosition);
        },
        (error) => {
          reject(this.formatError(error));
        },
        this.options
      );
    });
  }

  // Start watching position
  startWatching(callback, errorCallback) {
    if (!navigator.geolocation) {
      errorCallback?.(new Error('Geolocation is not supported'));
      return null;
    }

    if (this.watchId !== null) {
      this.stopWatching();
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.currentPosition = this.formatPosition(position);
        this.notifyListeners(this.currentPosition);
        callback?.(this.currentPosition);
      },
      (error) => {
        const formattedError = this.formatError(error);
        errorCallback?.(formattedError);
      },
      this.options
    );

    return this.watchId;
  }

  // Stop watching position
  stopWatching() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Add listener for position updates
  addListener(callback) {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  // Notify all listeners
  notifyListeners(position) {
    this.listeners.forEach(callback => {
      try {
        callback(position);
      } catch (error) {
        console.error('Error in geolocation listener:', error);
      }
    });
  }

  // Format position object
  formatPosition(position) {
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      altitudeAccuracy: position.coords.altitudeAccuracy,
      heading: position.coords.heading,
      speed: position.coords.speed,
      timestamp: position.timestamp,
      coordinates: [position.coords.longitude, position.coords.latitude] // GeoJSON format
    };
  }

  // Format error object
  formatError(error) {
    const errorMessages = {
      1: 'Permission denied',
      2: 'Position unavailable',
      3: 'Timeout'
    };

    return {
      code: error.code,
      message: errorMessages[error.code] || error.message
    };
  }

  // Calculate distance between two points (Haversine formula)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  // Calculate bearing between two points
  calculateBearing(lat1, lon1, lat2, lon2) {
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) -
              Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    
    const θ = Math.atan2(y, x);
    const bearing = (θ * 180 / Math.PI + 360) % 360;

    return bearing;
  }

  // Check if position is within radius
  isWithinRadius(centerLat, centerLon, pointLat, pointLon, radius) {
    const distance = this.calculateDistance(centerLat, centerLon, pointLat, pointLon);
    return distance <= radius;
  }

  // Get current position or return cached
  getPosition() {
    return this.currentPosition;
  }

  // Check if geolocation is available
  isAvailable() {
    return 'geolocation' in navigator;
  }

  // Request permission (for browsers that support it)
  async requestPermission() {
    if (!this.isAvailable()) {
      throw new Error('Geolocation is not supported');
    }

    try {
      const position = await this.getCurrentPosition();
      return { granted: true, position };
    } catch (error) {
      return { granted: false, error };
    }
  }

  // Set options
  setOptions(options) {
    this.options = { ...this.options, ...options };
  }
}

const geolocationService = new GeolocationService();
export default geolocationService;
