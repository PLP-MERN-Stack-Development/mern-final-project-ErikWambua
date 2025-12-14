// Helper utility functions

import { format, formatDistanceToNow, formatDistanceToNowStrict, isBefore, isAfter, isSameDay, isSameWeek, subDays } from 'date-fns';
import { CROWD_COLORS, DATE_FORMATS } from './constants';

/**
 * Format date/time
 */
export const formatDate = (date, formatStr = DATE_FORMATS.FULL) => {
  if (!date) return '';
  return format(new Date(date), formatStr);
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

/**
 * Get time remaining (e.g., "in 5 minutes")
 */
export const getTimeRemaining = (date) => {
  if (!date) return '';
  return formatDistanceToNowStrict(new Date(date));
};

/**
 * Format currency (KES)
 */
export const formatCurrency = (amount, showCurrency = true) => {
  if (typeof amount !== 'number') return '0';
  
  const formatted = amount.toLocaleString('en-KE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  
  return showCurrency ? `KES ${formatted}` : formatted;
};

/**
 * Format distance
 */
export const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

/**
 * Format duration
 */
export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${Math.round(minutes)}min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

/**
 * Get crowd level color
 */
export const getCrowdColor = (crowdLevel) => {
  return CROWD_COLORS[crowdLevel] || CROWD_COLORS.empty;
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Debounce function
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Generate random ID
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj) => {
  if (obj === null || obj === undefined) return true;
  if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

/**
 * Sleep function
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Capitalize words
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
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
 * Parse Kenyan phone number to international format
 */
export const parsePhoneNumber = (phone) => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('254')) {
    return `+${cleaned}`;
  }
  
  if (cleaned.startsWith('0')) {
    return `+254${cleaned.slice(1)}`;
  }
  
  return `+254${cleaned}`;
};

/**
 * Get ETA badge color
 */
export const getETABadgeColor = (minutes) => {
  if (minutes <= 5) return 'green';
  if (minutes <= 15) return 'blue';
  if (minutes <= 30) return 'yellow';
  return 'gray';
};

/**
 * Check if time is in past
 */
export const isPast = (date) => {
  return isBefore(new Date(date), new Date());
};

/**
 * Check if time is in future
 */
export const isFuture = (date) => {
  return isAfter(new Date(date), new Date());
};

/**
 * Get day of week
 */
export const getDayOfWeek = (date) => {
  return format(new Date(date), 'EEEE');
};

/**
 * Check if today
 */
export const isToday = (date) => {
  return isSameDay(new Date(date), new Date());
};

/**
 * Check if yesterday
 */
export const isYesterday = (date) => {
  return isSameDay(new Date(date), subDays(new Date(), 1));
};

/**
 * Get smart date label
 */
export const getSmartDateLabel = (date) => {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  if (isSameWeek(new Date(date), new Date())) return getDayOfWeek(date);
  return formatDate(date, DATE_FORMATS.SHORT);
};

/**
 * Group array by key
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

/**
 * Sort array by key
 */
export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Remove duplicates from array
 */
export const unique = (array, key) => {
  if (!key) return [...new Set(array)];
  
  const seen = new Set();
  return array.filter(item => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
};

/**
 * Chunk array into smaller arrays
 */
export const chunk = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Get file extension
 */
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

/**
 * Get file size in human readable format
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Download file
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Copy to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

/**
 * Share content (Web Share API)
 */
export const shareContent = async (data) => {
  if (navigator.share) {
    try {
      await navigator.share(data);
      return true;
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
      return false;
    }
  }
  return false;
};

export default {
  formatDate,
  getRelativeTime,
  getTimeRemaining,
  formatCurrency,
  formatDistance,
  formatDuration,
  getCrowdColor,
  getInitials,
  truncateText,
  debounce,
  throttle,
  generateId,
  deepClone,
  isEmpty,
  sleep,
  capitalize,
  capitalizeWords,
  formatPhoneNumber,
  parsePhoneNumber,
  getETABadgeColor,
  isPast,
  isFuture,
  getDayOfWeek,
  isToday,
  isYesterday,
  getSmartDateLabel,
  groupBy,
  sortBy,
  unique,
  chunk,
  getFileExtension,
  formatFileSize,
  downloadFile,
  copyToClipboard,
  shareContent
};
