// Local Storage utility functions with error handling

const STORAGE_PREFIX = 'matpulse_';

/**
 * Get item from localStorage
 * @param {string} key
 * @param {any} defaultValue
 * @returns {any}
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
};

/**
 * Set item in localStorage
 * @param {string} key
 * @param {any} value
 * @returns {boolean} Success status
 */
export const setItem = (key, value) => {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Remove item from localStorage
 * @param {string} key
 * @returns {boolean} Success status
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Clear all items with app prefix from localStorage
 * @returns {boolean} Success status
 */
export const clear = () => {
  try {
    Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Check if localStorage is available
 * @returns {boolean}
 */
export const isAvailable = () => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Get storage size in bytes
 * @returns {number}
 */
export const getSize = () => {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key) && key.startsWith(STORAGE_PREFIX)) {
      total += localStorage[key].length + key.length;
    }
  }
  return total;
};

/**
 * Get all keys with app prefix
 * @returns {Array<string>}
 */
export const getAllKeys = () => {
  return Object.keys(localStorage)
    .filter(key => key.startsWith(STORAGE_PREFIX))
    .map(key => key.replace(STORAGE_PREFIX, ''));
};

/**
 * Session Storage utilities
 */
export const session = {
  getItem: (key, defaultValue = null) => {
    try {
      const item = sessionStorage.getItem(`${STORAGE_PREFIX}${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from sessionStorage (${key}):`, error);
      return defaultValue;
    }
  },

  setItem: (key, value) => {
    try {
      sessionStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to sessionStorage (${key}):`, error);
      return false;
    }
  },

  removeItem: (key) => {
    try {
      sessionStorage.removeItem(`${STORAGE_PREFIX}${key}`);
      return true;
    } catch (error) {
      console.error(`Error removing from sessionStorage (${key}):`, error);
      return false;
    }
  },

  clear: () => {
    try {
      Object.keys(sessionStorage)
        .filter(key => key.startsWith(STORAGE_PREFIX))
        .forEach(key => sessionStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
      return false;
    }
  }
};

export default {
  getItem,
  setItem,
  removeItem,
  clear,
  isAvailable,
  getSize,
  getAllKeys,
  session
};
