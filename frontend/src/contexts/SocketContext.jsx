import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [lastPing, setLastPing] = useState(Date.now());
  const { token, user } = useAuth();

  const connectSocket = useCallback(() => {
    if (!token || socket?.connected) return;

    const socketInstance = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
      setReconnectAttempts(0);
      
      // Join user-specific room
      if (user?._id) {
        socketInstance.emit('join-user-room', user._id);
      }
      
      toast.success('Connected to live updates', {
        icon: '📡',
        duration: 2000,
      });
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
      
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, try to reconnect
        socketInstance.connect();
      }
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setReconnectAttempts(prev => prev + 1);
      
      if (reconnectAttempts >= 3) {
        toast.error('Connection issues. Trying to reconnect...', {
          duration: 3000,
        });
      }
    });

    socketInstance.on('reconnect', (attemptNumber) => {
      console.log(`Reconnected after ${attemptNumber} attempts`);
      toast.success('Reconnected to live updates', {
        icon: '🔄',
        duration: 2000,
      });
    });

    socketInstance.on('reconnect_attempt', (attemptNumber) => {
      console.log(`Reconnection attempt ${attemptNumber}`);
    });

    socketInstance.on('reconnect_error', (error) => {
      console.error('Reconnection error:', error);
    });

    socketInstance.on('reconnect_failed', () => {
      console.error('Reconnection failed');
      toast.error('Failed to connect to live updates', {
        duration: 5000,
      });
    });

    socketInstance.on('ping', () => {
      setLastPing(Date.now());
      socketInstance.emit('pong');
    });

    // Custom event handlers
    socketInstance.on('trip-update', (data) => {
      console.log('Trip update received:', data);
      // This will be handled by components that listen to this event
    });

    socketInstance.on('trip-ended', (data) => {
      console.log('Trip ended:', data);
    });

    socketInstance.on('new-alert', (alert) => {
      console.log('New alert:', alert);
      // Show notification for relevant alerts
      if (user?.role === 'passenger') {
        toast(`🚨 ${alert.type}: ${alert.message}`, {
          duration: 5000,
          icon: '⚠️',
        });
      }
    });

    socketInstance.on('driver-status', (data) => {
      console.log('Driver status update:', data);
    });

    socketInstance.on('capacity-change', (data) => {
      console.log('Capacity change:', data);
    });

    socketInstance.on('announcement', (announcement) => {
      console.log('New announcement:', announcement);
      toast(`📢 ${announcement.title}: ${announcement.message}`, {
        duration: 6000,
        icon: '📣',
      });
    });

    setSocket(socketInstance);

    return socketInstance;
  }, [token, user, reconnectAttempts]);

  useEffect(() => {
    let socketInstance;

    if (token) {
      socketInstance = connectSocket();
    }

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
    };
  }, [token, connectSocket]);

  const joinRoom = (roomId) => {
    if (socket && isConnected) {
      socket.emit('join-room', roomId);
      console.log(`Joined room: ${roomId}`);
    }
  };

  const leaveRoom = (roomId) => {
    if (socket && isConnected) {
      socket.emit('leave-room', roomId);
      console.log(`Left room: ${roomId}`);
    }
  };

  const sendLocation = (location, metadata = {}) => {
    if (socket && isConnected) {
      socket.emit('location-update', {
        location,
        userId: user?._id,
        userType: user?.role,
        timestamp: Date.now(),
        ...metadata
      });
    }
  };

  const reportAlert = (alertData) => {
    if (socket && isConnected) {
      socket.emit('report-alert', {
        ...alertData,
        userId: user?._id,
        timestamp: Date.now()
      });
    }
  };

  const updateCapacity = (tripId, capacity) => {
    if (socket && isConnected) {
      socket.emit('capacity-update', {
        tripId,
        capacity,
        timestamp: Date.now()
      });
    }
  };

  const startTrip = (tripData) => {
    if (socket && isConnected) {
      socket.emit('trip-started', {
        ...tripData,
        driverId: user?._id,
        timestamp: Date.now()
      });
    }
  };

  const endTrip = (tripId) => {
    if (socket && isConnected) {
      socket.emit('trip-ended', {
        tripId,
        driverId: user?._id,
        timestamp: Date.now()
      });
    }
  };

  const sendMessage = (roomId, message) => {
    if (socket && isConnected) {
      socket.emit('send-message', {
        roomId,
        message,
        userId: user?._id,
        timestamp: Date.now()
      });
    }
  };

  const value = {
    socket,
    isConnected,
    joinRoom,
    leaveRoom,
    sendLocation,
    reportAlert,
    updateCapacity,
    startTrip,
    endTrip,
    sendMessage,
    lastPing
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};