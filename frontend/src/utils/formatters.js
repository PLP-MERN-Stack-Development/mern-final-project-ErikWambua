// Formatter utility functions for MatPulse254

import { format, formatDistanceToNow, formatDistanceToNowStrict } from 'date-fns';

/**
 * Format currency in Kenyan Shillings
 */
export const formatCurrency = (amount, options = {}) => {
  const {
    showSymbol = true,
    decimals = 0,
    locale = 'en-KE'
  } = options;

  if (typeof amount !== 'number' || isNaN(amount)) {
    return showSymbol ? 'KES 0' : '0';
  }

  const formatted = amount.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  return showSymbol ? `KES ${formatted}` : formatted;
};

/**
 * Format date to readable string
 */
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return '';
  try {
    return format(new Date(date), formatString);
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
};

/**
 * Format time
 */
export const formatTime = (date, is24Hour = false) => {
  if (!date) return '';
  try {
    return format(new Date(date), is24Hour ? 'HH:mm' : 'hh:mm a');
  } catch (error) {
    console.error('Time formatting error:', error);
    return '';
  }
};

/**
 * Format date and time
 */
export const formatDateTime = (date, formatString = 'MMM dd, yyyy hh:mm a') => {
  if (!date) return '';
  try {
    return format(new Date(date), formatString);
  } catch (error) {
    console.error('DateTime formatting error:', error);
    return '';
  }
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch (error) {
    console.error('Relative time formatting error:', error);
    return '';
  }
};

/**
 * Format ETA time remaining
 */
export const formatETA = (date) => {
  if (!date) return '';
  try {
    const distance = formatDistanceToNowStrict(new Date(date));
    return `in ${distance}`;
  } catch (error) {
    console.error('ETA formatting error:', error);
    return '';
  }
};

/**
 * Format duration in minutes
 */
export const formatDuration = (minutes) => {
  if (typeof minutes !== 'number' || isNaN(minutes)) return '0 min';

  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  if (mins === 0) {
    return `${hours} hr${hours > 1 ? 's' : ''}`;
  }

  return `${hours} hr${hours > 1 ? 's' : ''} ${mins} min`;
};

/**
 * Format distance in meters
 */
export const formatDistance = (meters, useMetric = true) => {
  if (typeof meters !== 'number' || isNaN(meters)) return '0 m';

  if (useMetric) {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  } else {
    const feet = meters * 3.28084;
    if (feet < 5280) {
      return `${Math.round(feet)} ft`;
    }
    return `${(feet / 5280).toFixed(1)} mi`;
  }
};

/**
 * Format speed
 */
export const formatSpeed = (metersPerSecond, useMetric = true) => {
  if (typeof metersPerSecond !== 'number' || isNaN(metersPerSecond)) return '0 km/h';

  if (useMetric) {
    const kmh = metersPerSecond * 3.6;
    return `${Math.round(kmh)} km/h`;
  } else {
    const mph = metersPerSecond * 2.23694;
    return `${Math.round(mph)} mph`;
  }
};

/**
 * Format phone number (Kenyan format)
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Format as +254 XXX XXX XXX
  if (cleaned.startsWith('254')) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }

  // Format as 07XX XXX XXX
  if (cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }

  return phone;
};

/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 0) => {
  if (typeof value !== 'number' || isNaN(value)) return '0%';
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format number with abbreviation (1K, 1M, etc.)
 */
export const formatNumberShort = (num) => {
  if (typeof num !== 'number' || isNaN(num)) return '0';

  const absNum = Math.abs(num);

  if (absNum >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (absNum >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (absNum >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }

  return num.toString();
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (typeof bytes !== 'number' || isNaN(bytes)) return '0 Bytes';

  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format capacity/occupancy
 */
export const formatCapacity = (current, max) => {
  if (typeof current !== 'number' || typeof max !== 'number') return '0/0';
  return `${current}/${max}`;
};

/**
 * Format capacity percentage
 */
export const formatCapacityPercentage = (current, max) => {
  if (typeof current !== 'number' || typeof max !== 'number' || max === 0) return '0%';
  const percentage = (current / max) * 100;
  return `${Math.round(percentage)}%`;
};

/**
 * Format route name
 */
export const formatRouteName = (origin, destination) => {
  if (!origin || !destination) return 'Unknown Route';
  return `${origin} → ${destination}`;
};

/**
 * Format plate number
 */
export const formatPlateNumber = (plate) => {
  if (!plate) return '';
  return plate.toUpperCase().replace(/[^A-Z0-9]/g, '');
};

/**
 * Format initials from name
 */
export const formatInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Format coordinates
 */
export const formatCoordinates = (lat, lng, decimals = 6) => {
  if (typeof lat !== 'number' || typeof lng !== 'number') return '';
  return `${lat.toFixed(decimals)}, ${lng.toFixed(decimals)}`;
};

/**
 * Truncate text
 */
export const truncate = (text, maxLength = 50, suffix = '...') => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + suffix;
};

/**
 * Format list with commas and "and"
 */
export const formatList = (items, conjunction = 'and') => {
  if (!Array.isArray(items) || items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;

  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1).join(', ');
  return `${otherItems}, ${conjunction} ${lastItem}`;
};

export default {
  formatCurrency,
  formatDate,
  formatTime,
  formatDateTime,
  formatRelativeTime,
  formatETA,
  formatDuration,
  formatDistance,
  formatSpeed,
  formatPhoneNumber,
  formatPercentage,
  formatNumberShort,
  formatFileSize,
  formatCapacity,
  formatCapacityPercentage,
  formatRouteName,
  formatPlateNumber,
  formatInitials,
  formatCoordinates,
  truncate,
  formatList
};
