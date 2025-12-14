import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

const OfflineContext = createContext();

export const useOffline = () => useContext(OfflineContext);

export const OfflineProvider = ({ children }) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState(() => {
    const saved = localStorage.getItem('offlineQueue');
    return saved ? JSON.parse(saved) : [];
  });
  const [lastSync, setLastSync] = useState(() => {
    return localStorage.getItem('lastSync') || null;
  });
  
  const queryClient = useQueryClient();

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      toast.success('Back online! Syncing data...', {
        icon: '📡',
        duration: 3000,
      });
      processOfflineQueue();
    };

    const handleOffline = () => {
      setIsOffline(true);
      toast.error('You are offline. Some features may be limited.', {
        duration: 5000,
        icon: '📶',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save offline queue to localStorage
  useEffect(() => {
    localStorage.setItem('offlineQueue', JSON.stringify(offlineQueue));
  }, [offlineQueue]);

  const addToQueue = useCallback((action, data) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const queueItem = {
      id,
      action,
      data,
      timestamp: new Date().toISOString(),
      retries: 0
    };

    setOfflineQueue(prev => [...prev, queueItem]);
    
    toast('Action saved for offline sync', {
      icon: '💾',
      duration: 3000,
    });

    return id;
  }, []);

  const processOfflineQueue = useCallback(async () => {
    if (offlineQueue.length === 0 || isOffline) return;

    const successItems = [];
    const failedItems = [];

    for (const item of offlineQueue) {
      try {
        // Here you would make the actual API call
        // For now, we'll simulate success
        await new Promise(resolve => setTimeout(resolve, 500));
        
        successItems.push(item.id);
        
        // Invalidate relevant queries
        if (item.action.includes('trip') || item.action.includes('location')) {
          queryClient.invalidateQueries({ queryKey: ['trips'] });
        }
        if (item.action.includes('report')) {
          queryClient.invalidateQueries({ queryKey: ['alerts'] });
        }
      } catch (error) {
        if (item.retries < 3) {
          // Retry failed items
          failedItems.push({
            ...item,
            retries: item.retries + 1
          });
        } else {
          console.error('Failed to sync after 3 retries:', item);
        }
      }
    }

    // Remove successful items
    setOfflineQueue(prev => 
      prev.filter(item => !successItems.includes(item.id))
    );

    // Update failed items
    if (failedItems.length > 0) {
      setOfflineQueue(prev => [
        ...prev.filter(item => !successItems.includes(item.id)),
        ...failedItems
      ]);
    }

    if (successItems.length > 0) {
      setLastSync(new Date().toISOString());
      localStorage.setItem('lastSync', new Date().toISOString());
      
      toast.success(`Synced ${successItems.length} items`, {
        duration: 3000,
      });
    }
  }, [offlineQueue, isOffline, queryClient]);

  // Auto-sync when coming online
  useEffect(() => {
    if (!isOffline && offlineQueue.length > 0) {
      processOfflineQueue();
    }
  }, [isOffline, offlineQueue.length, processOfflineQueue]);

  const clearQueue = useCallback(() => {
    setOfflineQueue([]);
    toast('Offline queue cleared', {
      icon: '🗑️',
    });
  }, []);

  const getQueueStats = useCallback(() => {
    return {
      total: offlineQueue.length,
      byAction: offlineQueue.reduce((acc, item) => {
        acc[item.action] = (acc[item.action] || 0) + 1;
        return acc;
      }, {})
    };
  }, [offlineQueue]);

  const value = {
    isOffline,
    offlineQueue,
    lastSync,
    addToQueue,
    processOfflineQueue,
    clearQueue,
    getQueueStats,
    queueSize: offlineQueue.length
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
};