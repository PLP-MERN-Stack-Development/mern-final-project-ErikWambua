import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const useSocket = (roomId) => {
  const { token, user } = useAuth();
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [trips, setTrips] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const connect = useCallback(() => {
    if (!token || socketRef.current?.connected) return;

    const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Socket connected');
      
      // Join room if specified
      if (roomId) {
        socket.emit('join-room', roomId);
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    });

    socket.on('trip-update', (tripData) => {
      setTrips(prev => {
        const existingIndex = prev.findIndex(t => t._id === tripData._id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = { ...updated[existingIndex], ...tripData };
          return updated;
        }
        return [...prev, tripData];
      });
    });

    socket.on('trip-ended', (tripId) => {
      setTrips(prev => prev.filter(t => t._id !== tripId));
    });

    socket.on('new-alert', (alert) => {
      setAlerts(prev => [alert, ...prev]);
      
      // Show notification for relevant users
      if (user?.role === 'passenger') {
        toast(`🚨 ${alert.type}: ${alert.message}`, {
          duration: 5000,
          icon: '⚠️',
        });
      }
    });

    socket.on('capacity-change', ({ tripId, capacity }) => {
      setTrips(prev => prev.map(trip => 
        trip._id === tripId ? { ...trip, capacity } : trip
      ));
    });

    socket.on('message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
      toast.error('Connection error. Please refresh.');
    });

    socketRef.current = socket;
  }, [token, roomId, user]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const sendLocation = useCallback((location, metadata = {}) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('location-update', {
        location,
        userId: user?._id,
        userType: user?.role,
        timestamp: Date.now(),
        ...metadata
      });
    }
  }, [user]);

  const reportAlert = useCallback((alertData) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('report-alert', {
        ...alertData,
        userId: user?._id,
        timestamp: Date.now()
      });
    }
  }, [user]);

  const updateCapacity = useCallback((tripId, capacity) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('capacity-update', {
        tripId,
        capacity,
        timestamp: Date.now()
      });
    }
  }, []);

  const sendMessage = useCallback((message, roomId = roomId) => {
    if (socketRef.current?.connected && roomId) {
      socketRef.current.emit('send-message', {
        roomId,
        message,
        userId: user?._id,
        timestamp: Date.now()
      });
    }
  }, [roomId, user]);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    socket: socketRef.current,
    isConnected,
    trips,
    alerts,
    messages,
    sendLocation,
    reportAlert,
    updateCapacity,
    sendMessage,
    disconnect,
    reconnect: connect
  };
};

export default useSocket;