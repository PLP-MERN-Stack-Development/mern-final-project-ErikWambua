const socketService = require('../services/socketService');

let io;

exports.initSocket = (server) => {
  io = socketService.initSocket(server);
  return io;
};

exports.getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};