// Calculation utility functions for MatPulse254

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in meters
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

/**
 * Calculate bearing between two coordinates
 * @returns {number} Bearing in degrees (0-360)
 */
export const calculateBearing = (lat1, lon1, lat2, lon2) => {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const θ = Math.atan2(y, x);
  const bearing = ((θ * 180) / Math.PI + 360) % 360;

  return bearing;
};

/**
 * Calculate ETA based on distance and average speed
 * @param {number} distanceMeters - Distance in meters
 * @param {number} speedKmh - Average speed in km/h
 * @returns {number} ETA in minutes
 */
export const calculateETA = (distanceMeters, speedKmh = 30) => {
  if (distanceMeters <= 0 || speedKmh <= 0) return 0;

  const distanceKm = distanceMeters / 1000;
  const timeHours = distanceKm / speedKmh;
  return Math.round(timeHours * 60); // Convert to minutes
};

/**
 * Calculate dynamic ETA with traffic consideration
 * @param {number} distanceMeters - Distance in meters
 * @param {string} trafficLevel - 'clear', 'moderate', 'heavy', 'gridlock'
 * @returns {number} ETA in minutes
 */
export const calculateDynamicETA = (distanceMeters, trafficLevel = 'moderate') => {
  const baseSpeed = {
    clear: 40,      // km/h
    moderate: 30,   // km/h
    heavy: 20,      // km/h
    gridlock: 10    // km/h
  };

  const speed = baseSpeed[trafficLevel] || baseSpeed.moderate;
  return calculateETA(distanceMeters, speed);
};

/**
 * Calculate capacity percentage
 * @param {number} current - Current occupancy
 * @param {number} max - Maximum capacity
 * @returns {number} Percentage (0-100)
 */
export const calculateCapacityPercentage = (current, max) => {
  if (max === 0) return 0;
  return Math.min(100, Math.round((current / max) * 100));
};

/**
 * Determine crowd level based on capacity
 * @param {number} current - Current occupancy
 * @param {number} max - Maximum capacity
 * @returns {string} Crowd level: 'empty', 'low', 'half', 'high', 'full', 'standing'
 */
export const calculateCrowdLevel = (current, max) => {
  const percentage = calculateCapacityPercentage(current, max);

  if (percentage === 0) return 'empty';
  if (percentage <= 30) return 'low';
  if (percentage <= 60) return 'half';
  if (percentage <= 90) return 'high';
  if (percentage <= 100) return 'full';
  return 'standing'; // Over capacity
};

/**
 * Calculate fare based on distance
 * @param {number} distanceMeters - Distance in meters
 * @param {number} baseRate - Base rate per km (default KES 50)
 * @param {number} minimumFare - Minimum fare (default KES 30)
 * @returns {number} Fare in KES
 */
export const calculateFare = (distanceMeters, baseRate = 50, minimumFare = 30) => {
  const distanceKm = distanceMeters / 1000;
  const calculatedFare = distanceKm * baseRate;
  return Math.max(minimumFare, Math.round(calculatedFare));
};

/**
 * Calculate average speed from location updates
 * @param {Array} locations - Array of location objects with {timestamp, lat, lng}
 * @returns {number} Average speed in km/h
 */
export const calculateAverageSpeed = (locations) => {
  if (!locations || locations.length < 2) return 0;

  let totalDistance = 0;
  let totalTime = 0;

  for (let i = 1; i < locations.length; i++) {
    const prev = locations[i - 1];
    const curr = locations[i];

    const distance = calculateDistance(prev.lat, prev.lng, curr.lat, curr.lng);
    const timeDiff = (new Date(curr.timestamp) - new Date(prev.timestamp)) / 1000; // seconds

    totalDistance += distance;
    totalTime += timeDiff;
  }

  if (totalTime === 0) return 0;

  const speedMps = totalDistance / totalTime; // meters per second
  return speedMps * 3.6; // Convert to km/h
};

/**
 * Calculate percentage change
 * @param {number} oldValue
 * @param {number} newValue
 * @returns {number} Percentage change
 */
export const calculatePercentageChange = (oldValue, newValue) => {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
};

/**
 * Calculate midpoint between two coordinates
 * @returns {object} {lat, lng}
 */
export const calculateMidpoint = (lat1, lon1, lat2, lon2) => {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const λ1 = (lon1 * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const Bx = Math.cos(φ2) * Math.cos(Δλ);
  const By = Math.cos(φ2) * Math.sin(Δλ);

  const φ3 = Math.atan2(
    Math.sin(φ1) + Math.sin(φ2),
    Math.sqrt((Math.cos(φ1) + Bx) * (Math.cos(φ1) + Bx) + By * By)
  );
  const λ3 = λ1 + Math.atan2(By, Math.cos(φ1) + Bx);

  return {
    lat: (φ3 * 180) / Math.PI,
    lng: (λ3 * 180) / Math.PI
  };
};

/**
 * Calculate bounding box for multiple coordinates
 * @param {Array} coordinates - Array of {lat, lng} objects
 * @returns {object} {minLat, maxLat, minLng, maxLng}
 */
export const calculateBounds = (coordinates) => {
  if (!coordinates || coordinates.length === 0) return null;

  let minLat = coordinates[0].lat;
  let maxLat = coordinates[0].lat;
  let minLng = coordinates[0].lng;
  let maxLng = coordinates[0].lng;

  coordinates.forEach(coord => {
    minLat = Math.min(minLat, coord.lat);
    maxLat = Math.max(maxLat, coord.lat);
    minLng = Math.min(minLng, coord.lng);
    maxLng = Math.max(maxLng, coord.lng);
  });

  return { minLat, maxLat, minLng, maxLng };
};

/**
 * Check if point is within radius of another point
 * @param {number} centerLat
 * @param {number} centerLng
 * @param {number} pointLat
 * @param {number} pointLng
 * @param {number} radiusMeters
 * @returns {boolean}
 */
export const isWithinRadius = (centerLat, centerLng, pointLat, pointLng, radiusMeters) => {
  const distance = calculateDistance(centerLat, centerLng, pointLat, pointLng);
  return distance <= radiusMeters;
};

/**
 * Calculate trip earnings
 * @param {number} fare - Base fare
 * @param {number} passengerCount - Number of passengers
 * @param {number} commission - Commission percentage (default 10%)
 * @returns {object} {gross, commission, net}
 */
export const calculateTripEarnings = (fare, passengerCount, commission = 10) => {
  const gross = fare * passengerCount;
  const commissionAmount = (gross * commission) / 100;
  const net = gross - commissionAmount;

  return {
    gross: Math.round(gross),
    commission: Math.round(commissionAmount),
    net: Math.round(net)
  };
};

/**
 * Calculate driver rating average
 * @param {Array} ratings - Array of rating objects
 * @returns {number} Average rating (0-5)
 */
export const calculateAverageRating = (ratings) => {
  if (!ratings || ratings.length === 0) return 0;

  const total = ratings.reduce((sum, rating) => sum + rating.value, 0);
  return Math.round((total / ratings.length) * 10) / 10; // Round to 1 decimal
};

/**
 * Calculate completion rate
 * @param {number} completed - Number of completed trips
 * @param {number} total - Total number of trips
 * @returns {number} Percentage (0-100)
 */
export const calculateCompletionRate = (completed, total) => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export default {
  calculateDistance,
  calculateBearing,
  calculateETA,
  calculateDynamicETA,
  calculateCapacityPercentage,
  calculateCrowdLevel,
  calculateFare,
  calculateAverageSpeed,
  calculatePercentageChange,
  calculateMidpoint,
  calculateBounds,
  isWithinRadius,
  calculateTripEarnings,
  calculateAverageRating,
  calculateCompletionRate
};
