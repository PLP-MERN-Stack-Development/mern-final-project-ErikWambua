// Cache Service for managing local caching

class CacheService {
  constructor() {
    this.cache = new Map();
    this.expiryTimes = new Map();
  }

  // Set cache with optional expiry time (in milliseconds)
  set(key, value, ttl = null) {
    this.cache.set(key, value);
    
    if (ttl) {
      const expiryTime = Date.now() + ttl;
      this.expiryTimes.set(key, expiryTime);
    }

    // Also store in localStorage for persistence
    try {
      const cacheData = {
        value,
        expiryTime: ttl ? Date.now() + ttl : null,
        timestamp: Date.now()
      };
      localStorage.setItem(`cache_${key}`, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to cache in localStorage:', error);
    }
  }

  // Get cached value
  get(key) {
    // Check if expired
    if (this.isExpired(key)) {
      this.delete(key);
      return null;
    }

    // Try memory cache first
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    // Try localStorage
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (cached) {
        const cacheData = JSON.parse(cached);
        
        // Check expiry
        if (cacheData.expiryTime && Date.now() > cacheData.expiryTime) {
          this.delete(key);
          return null;
        }

        // Restore to memory cache
        this.cache.set(key, cacheData.value);
        if (cacheData.expiryTime) {
          this.expiryTimes.set(key, cacheData.expiryTime);
        }

        return cacheData.value;
      }
    } catch (error) {
      console.warn('Failed to get from localStorage:', error);
    }

    return null;
  }

  // Check if cache entry has expired
  isExpired(key) {
    if (!this.expiryTimes.has(key)) {
      return false;
    }

    return Date.now() > this.expiryTimes.get(key);
  }

  // Delete cache entry
  delete(key) {
    this.cache.delete(key);
    this.expiryTimes.delete(key);
    
    try {
      localStorage.removeItem(`cache_${key}`);
    } catch (error) {
      console.warn('Failed to delete from localStorage:', error);
    }
  }

  // Clear all cache
  clear() {
    this.cache.clear();
    this.expiryTimes.clear();

    // Clear localStorage cache entries
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear localStorage cache:', error);
    }
  }

  // Get or fetch with caching
  async getOrFetch(key, fetchFn, ttl = 60000) {
    const cached = this.get(key);
    if (cached !== null) {
      return cached;
    }

    const value = await fetchFn();
    this.set(key, value, ttl);
    return value;
  }

  // Check if key exists in cache
  has(key) {
    if (this.isExpired(key)) {
      this.delete(key);
      return false;
    }

    return this.cache.has(key) || localStorage.getItem(`cache_${key}`) !== null;
  }

  // Get cache size
  size() {
    return this.cache.size;
  }

  // Get all keys
  keys() {
    return Array.from(this.cache.keys());
  }

  // Clean up expired entries
  cleanup() {
    const now = Date.now();
    const expiredKeys = [];

    this.expiryTimes.forEach((expiryTime, key) => {
      if (now > expiryTime) {
        expiredKeys.push(key);
      }
    });

    expiredKeys.forEach(key => this.delete(key));

    return expiredKeys.length;
  }
}

const cacheService = new CacheService();

// Auto cleanup every 5 minutes
setInterval(() => {
  const cleaned = cacheService.cleanup();
  if (cleaned > 0) {
    console.log(`Cache cleanup: removed ${cleaned} expired entries`);
  }
}, 5 * 60 * 1000);

export default cacheService;
