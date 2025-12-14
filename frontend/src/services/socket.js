import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  connect(token) {
    if (this.socket?.connected) return;

    this.socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
      timeout: 10000,
    });

    this.setupEventListeners();
  }

  setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.reconnectAttempts = 0;
      this.emitToListeners('connect', null);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.emitToListeners('disconnect', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;
      this.emitToListeners('connect_error', error);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`Socket reconnected after ${attemptNumber} attempts`);
      this.emitToListeners('reconnect', attemptNumber);
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`Socket reconnection attempt ${attemptNumber}`);
      this.emitToListeners('reconnect_attempt', attemptNumber);
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('Socket reconnection error:', error);
      this.emitToListeners('reconnect_error', error);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('Socket reconnection failed');
      this.emitToListeners('reconnect_failed', null);
    });

    // Application events
    this.socket.on('trip-update', (data) => {
      this.emitToListeners('trip-update', data);
    });

    this.socket.on('trip-ended', (data) => {
      this.emitToListeners('trip-ended', data);
    });

    this.socket.on('new-alert', (data) => {
      this.emitToListeners('new-alert', data);
    });

    this.socket.on('driver-status', (data) => {
      this.emitToListeners('driver-status', data);
    });

    this.socket.on('capacity-change', (data) => {
      this.emitToListeners('capacity-change', data);
    });

    this.socket.on('announcement', (data) => {
      this.emitToListeners('announcement', data);
    });

    this.socket.on('message', (data) => {
      this.emitToListeners('message', data);
    });

    this.socket.on('location-update', (data) => {
      this.emitToListeners('location-update', data);
    });

    this.socket.on('reservation-update', (data) => {
      this.emitToListeners('reservation-update', data);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      this.emitToListeners('error', error);
    });
  }

  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
      return true;
    }
    return false;
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    // Also listen on socket if it exists
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }

    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emitToListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in listener for event ${event}:`, error);
        }
      });
    }
  }

  joinRoom(roomId) {
    return this.emit('join-room', roomId);
  }

  leaveRoom(roomId) {
    return this.emit('leave-room', roomId);
  }

  sendLocation(location, metadata = {}) {
    return this.emit('location-update', {
      location,
      ...metadata,
      timestamp: Date.now()
    });
  }

  reportAlert(alertData) {
    return this.emit('report-alert', {
      ...alertData,
      timestamp: Date.now()
    });
  }

  updateCapacity(tripId, capacity) {
    return this.emit('capacity-update', {
      tripId,
      capacity,
      timestamp: Date.now()
    });
  }

  startTrip(tripData) {
    return this.emit('trip-started', {
      ...tripData,
      timestamp: Date.now()
    });
  }

  endTrip(tripId) {
    return this.emit('trip-ended', {
      tripId,
      timestamp: Date.now()
    });
  }

  sendMessage(roomId, message) {
    return this.emit('send-message', {
      roomId,
      message,
      timestamp: Date.now()
    });
  }

  isConnected() {
    return this.socket?.connected || false;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  // Batch operations
  batchLocationUpdates(locations) {
    return this.emit('batch-location-updates', {
      locations,
      timestamp: Date.now()
    });
  }

  // Presence
  setPresence(status) {
    return this.emit('presence', {
      status,
      timestamp: Date.now()
    });
  }

  // Typing indicator
  setTyping(roomId, isTyping) {
    return this.emit('typing', {
      roomId,
      isTyping,
      timestamp: Date.now()
    });
  }

  // Read receipts
  markAsRead(messageId) {
    return this.emit('read-receipt', {
      messageId,
      timestamp: Date.now()
    });
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;