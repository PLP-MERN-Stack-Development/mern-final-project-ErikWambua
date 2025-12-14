const mongoose = require('mongoose');

// Set strictQuery to false to prepare for Mongoose 7
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Create geospatial indexes
    await createIndexes();
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const createIndexes = async () => {
  try {
    // Create 2dsphere index for location queries
    await mongoose.connection.collection('trips').createIndex({
      'currentLocation.coordinates': '2dsphere'
    });
    
    await mongoose.connection.collection('routes').createIndex({
      'path': '2dsphere'
    });
    
    console.log('✅ Geospatial indexes created');
  } catch (error) {
    console.error('Index creation error:', error);
  }
};

module.exports = connectDB;