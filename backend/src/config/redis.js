const redis = require('redis');
const { promisify } = require('util');

let client;
let getAsync;
let setAsync;
let delAsync;

exports.connectRedis = async () => {
  try {
    client = redis.createClient({
      url: process.env.REDIS_URL
    });

    client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    client.on('connect', () => {
      console.log('✅ Redis Connected');
    });

    await client.connect();

    // Promisify redis methods
    getAsync = promisify(client.get).bind(client);
    setAsync = promisify(client.set).bind(client);
    delAsync = promisify(client.del).bind(client);

  } catch (error) {
    console.error('Redis connection failed:', error);
    // In development, we can continue without Redis
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

// Get value from cache
exports.getCache = async (key) => {
  try {
    if (!client) return null;
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
};

// Set value in cache with TTL
exports.setCache = async (key, value, ttl = 300) => {
  try {
    if (!client) return;
    await client.set(key, JSON.stringify(value), {
      EX: ttl // TTL in seconds
    });
  } catch (error) {
    console.error('Redis set error:', error);
  }
};

// Delete value from cache
exports.deleteCache = async (key) => {
  try {
    if (!client) return;
    await client.del(key);
  } catch (error) {
    console.error('Redis delete error:', error);
  }
};

// Clear all cache (use with caution)
exports.clearCache = async () => {
  try {
    if (!client) return;
    await client.flushAll();
    console.log('Redis cache cleared');
  } catch (error) {
    console.error('Redis flush error:', error);
  }
};

// Get Redis client (for advanced operations)
exports.getClient = () => client;