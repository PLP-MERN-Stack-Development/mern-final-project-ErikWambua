// Storage Service for managing local storage, session storage, and IndexedDB

class StorageService {
  constructor() {
    this.prefix = 'matpulse_';
  }

  // LocalStorage operations
  setLocal(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, serialized);
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  getLocal(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  }

  removeLocal(key) {
    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }

  clearLocal() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  // SessionStorage operations
  setSession(key, value) {
    try {
      const serialized = JSON.stringify(value);
      sessionStorage.setItem(this.prefix + key, serialized);
      return true;
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
      return false;
    }
  }

  getSession(key, defaultValue = null) {
    try {
      const item = sessionStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from sessionStorage:', error);
      return defaultValue;
    }
  }

  removeSession(key) {
    try {
      sessionStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.error('Error removing from sessionStorage:', error);
      return false;
    }
  }

  clearSession() {
    try {
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          sessionStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
      return false;
    }
  }

  // Check storage availability
  isLocalStorageAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }

  isSessionStorageAvailable() {
    try {
      const test = '__storage_test__';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get storage size (approximate)
  getStorageSize() {
    let totalSize = 0;
    
    try {
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key) && key.startsWith(this.prefix)) {
          totalSize += localStorage[key].length + key.length;
        }
      }
    } catch (error) {
      console.error('Error calculating storage size:', error);
    }

    return totalSize;
  }

  // IndexedDB operations (for larger data)
  async openDB(dbName = 'MatPulseDB', version = 1) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.prefix + dbName, version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains('trips')) {
          db.createObjectStore('trips', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('routes')) {
          db.createObjectStore('routes', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('offline_queue')) {
          db.createObjectStore('offline_queue', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  async saveToIndexedDB(storeName, data) {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.put(data);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error saving to IndexedDB:', error);
      throw error;
    }
  }

  async getFromIndexedDB(storeName, key) {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error getting from IndexedDB:', error);
      throw error;
    }
  }

  async getAllFromIndexedDB(storeName) {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error getting all from IndexedDB:', error);
      throw error;
    }
  }

  async deleteFromIndexedDB(storeName, key) {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.delete(key);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error deleting from IndexedDB:', error);
      throw error;
    }
  }

  async clearIndexedDB(storeName) {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error clearing IndexedDB:', error);
      throw error;
    }
  }
}

const storageService = new StorageService();
export default storageService;
