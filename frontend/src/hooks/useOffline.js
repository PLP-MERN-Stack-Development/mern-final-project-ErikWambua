import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const useOffline = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [queue, setQueue] = useState(() => {
    try {
      const saved = localStorage.getItem('offlineQueue');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [syncStatus, setSyncStatus] = useState('idle');
  const [lastSync, setLastSync] = useState(() => {
    return localStorage.getItem('lastSync') || null;
  });
  
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      console.log('Device is online');
    };

    const handleOffline = () => {
      setIsOffline(true);
      console.log('Device is offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('offlineQueue', JSON.stringify(queue));
    } catch (error) {
      console.error('Failed to save queue:', error);
    }
  }, [queue]);

  const addToQueue = useCallback((action, data, retryCount = 0) => {
    const id = `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const queueItem = {
      id,
      action,
      data,
      timestamp: new Date().toISOString(),
      retryCount,
      status: 'pending'
    };

    setQueue(prev => [...prev, queueItem]);
    
    // Store in localStorage for persistence
    try {
      const savedQueue = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
      savedQueue.push(queueItem);
      localStorage.setItem('offlineQueue', JSON.stringify(savedQueue));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }

    return id;
  }, []);

  const removeFromQueue = useCallback((id) => {
    setQueue(prev => prev.filter(item => item.id !== id));
    
    // Update localStorage
    try {
      const savedQueue = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
      const updatedQueue = savedQueue.filter(item => item.id !== id);
      localStorage.setItem('offlineQueue', JSON.stringify(updatedQueue));
    } catch (error) {
      console.error('Failed to update localStorage:', error);
    }
  }, []);

  const updateQueueItem = useCallback((id, updates) => {
    setQueue(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
    
    // Update localStorage
    try {
      const savedQueue = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
      const updatedQueue = savedQueue.map(item => 
        item.id === id ? { ...item, ...updates } : item
      );
      localStorage.setItem('offlineQueue', JSON.stringify(updatedQueue));
    } catch (error) {
      console.error('Failed to update localStorage:', error);
    }
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
    localStorage.removeItem('offlineQueue');
  }, []);

  const syncQueue = useCallback(async () => {
    if (isOffline || queue.length === 0 || syncStatus === 'syncing') {
      return;
    }

    setSyncStatus('syncing');
    
    const pendingItems = queue.filter(item => item.status === 'pending');
    const results = {
      success: [],
      failed: []
    };

    for (const item of pendingItems) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mark as successful
        updateQueueItem(item.id, { status: 'completed', completedAt: new Date().toISOString() });
        results.success.push(item);
        
        // Invalidate relevant queries
        switch(item.action) {
          case 'report-alert':
            queryClient.invalidateQueries({ queryKey: ['alerts'] });
            break;
          case 'location-update':
            queryClient.invalidateQueries({ queryKey: ['trips'] });
            break;
          case 'reserve-seat':
            queryClient.invalidateQueries({ queryKey: ['reservations'] });
            break;
        }
      } catch (error) {
        if (item.retryCount < 3) {
          // Retry
          updateQueueItem(item.id, { 
            retryCount: item.retryCount + 1,
            lastError: error.message
          });
          results.failed.push(item);
        } else {
          // Mark as failed after max retries
          updateQueueItem(item.id, { 
            status: 'failed',
            lastError: error.message,
            failedAt: new Date().toISOString()
          });
          results.failed.push(item);
        }
      }
    }

    // Update last sync time
    const now = new Date().toISOString();
    setLastSync(now);
    localStorage.setItem('lastSync', now);

    setSyncStatus('idle');

    return results;
  }, [isOffline, queue, syncStatus, updateQueueItem, queryClient]);

  const getQueueStats = useCallback(() => {
    const stats = {
      total: queue.length,
      pending: queue.filter(item => item.status === 'pending').length,
      completed: queue.filter(item => item.status === 'completed').length,
      failed: queue.filter(item => item.status === 'failed').length,
      byAction: queue.reduce((acc, item) => {
        acc[item.action] = (acc[item.action] || 0) + 1;
        return acc;
      }, {})
    };
    
    return stats;
  }, [queue]);

  const getStoredData = useCallback((key) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }, []);

  const setStoredData = useCallback((key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch {
      return false;
    }
  }, []);

  const removeStoredData = useCallback((key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }, []);

  // Auto-sync when coming online
  useEffect(() => {
    if (!isOffline && queue.length > 0) {
      syncQueue();
    }
  }, [isOffline, queue.length, syncQueue]);

  return {
    isOffline,
    queue,
    syncStatus,
    lastSync,
    addToQueue,
    removeFromQueue,
    updateQueueItem,
    clearQueue,
    syncQueue,
    getQueueStats,
    getStoredData,
    setStoredData,
    removeStoredData,
    queueSize: queue.length
  };
};

export { useOffline };
export default useOffline;