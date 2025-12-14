const app = require('./app');
const connectDB = require('./config/database');
const { initSocket } = require('./config/socket');

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  console.log(`🌐 API: http://localhost:${PORT}`);
});

// Initialize Socket.io
initSocket(server);