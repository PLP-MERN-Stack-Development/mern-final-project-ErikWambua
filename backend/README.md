# 🚐 MatPulse254 Backend

> A robust Node.js/Express backend for real-time matatu tracking with MongoDB, Redis, Socket.io, and M-Pesa integration.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Real-time Events](#-real-time-events)
- [Services](#-services)
- [Middleware](#-middleware)
- [Testing](#-testing)
- [Deployment](#-deployment)

## ✨ Features

### Core Features
- 🔐 **JWT Authentication** - Secure token-based auth with refresh tokens
- 📱 **Phone Verification** - SMS OTP verification
- 🗺️ **Geospatial Queries** - MongoDB geospatial indexing
- 🔄 **Real-time Updates** - Socket.io for live tracking
- 💾 **Redis Caching** - Fast data retrieval and session management
- 💳 **M-Pesa Integration** - STK Push and payment callbacks
- 🌐 **i18n Support** - English and Swahili localization
- 🔒 **Security** - Helmet, CORS, Rate limiting
- 📊 **Analytics** - Trip and revenue analytics
- 🚨 **Alert System** - Real-time notifications

### API Features
- ✅ **Input Validation** - Express Validator
- 📝 **Error Handling** - Centralized error middleware
- 🔄 **Auto-Refresh** - JWT token refresh mechanism
- 📊 **Logging** - Morgan HTTP request logging
- 🎯 **Role-based Access** - Passenger, Driver, Admin roles
- 🔐 **Rate Limiting** - Prevent API abuse
- 📦 **Data Compression** - Gzip compression

## 🛠️ Tech Stack

### Core
- **Runtime:** Node.js 16+
- **Framework:** Express.js 4.18
- **Language:** JavaScript (ES6+)

### Database
- **Primary:** MongoDB 4.4+ with Mongoose 6.8
- **Cache:** Redis 4.6
- **Schema:** Mongoose ODM with GeoJSON

### Real-time
- **WebSocket:** Socket.io 4.5.4
- **Events:** Custom event system

### External APIs
- **Payments:** M-Pesa Daraja API
- **SMS:** AfricasTalking / Twilio
- **Maps:** Google Maps API (geocoding)

### Security
- **Authentication:** JWT (jsonwebtoken 9.0)
- **Encryption:** bcryptjs 2.4
- **Security Headers:** Helmet 7.0
- **CORS:** cors 2.8
- **Validation:** Express Validator 6.14, Validator 13.9

### Utilities
- **Geospatial:** Geolib 3.3, mongoose-geojson-schema
- **Math:** mathjs 11.8
- **HTTP:** Axios 1.3, node-fetch 3.3
- **Date:** moment 2.29
- **Logging:** Morgan 1.10

### Development
- **Dev Server:** Nodemon 2.0
- **Testing:** Jest 29.5, Supertest 6.3
- **Linting:** ESLint 8.38

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/                 # Configuration files
│   │   ├── database.js         # MongoDB connection
│   │   ├── redis.js            # Redis client
│   │   └── socket.js           # Socket.io setup
│   │
│   ├── controllers/            # Request handlers
│   │   ├── authController.js   # Authentication logic
│   │   ├── passengerController.js
│   │   ├── driverController.js
│   │   ├── saccoController.js
│   │   ├── tripController.js
│   │   └── paymentController.js
│   │
│   ├── middleware/             # Custom middleware
│   │   ├── auth.js             # JWT verification
│   │   ├── validate.js         # Request validation
│   │   ├── rateLimit.js        # Rate limiting
│   │   └── errorHandler.js     # Error handling
│   │
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js             # User model
│   │   ├── Trip.js             # Trip model
│   │   ├── Route.js            # Route model
│   │   ├── Vehicle.js          # Vehicle model
│   │   ├── Sacco.js            # Sacco model
│   │   ├── Reservation.js      # Reservation model
│   │   └── Alert.js            # Alert model
│   │
│   ├── routes/                 # API routes
│   │   ├── auth.js             # /api/auth/*
│   │   ├── passenger.js        # /api/passenger/*
│   │   ├── driver.js           # /api/driver/*
│   │   ├── sacco.js            # /api/sacco/*
│   │   ├── trips.js            # /api/trips/*
│   │   └── payments.js         # /api/payments/*
│   │
│   ├── services/               # Business logic
│   │   ├── socketService.js    # Real-time events
│   │   ├── tripService.js      # Trip operations
│   │   ├── mpesaService.js     # M-Pesa integration
│   │   ├── etaService.js       # ETA calculations
│   │   └── notificationService.js
│   │
│   ├── utils/                  # Utility functions
│   │   ├── helpers.js          # General helpers
│   │   ├── validators.js       # Custom validators
│   │   ├── calculations.js     # Math operations
│   │   └── constants.js        # App constants
│   │
│   ├── locales/                # i18n translations
│   │   ├── en.json             # English
│   │   └── sw.json             # Swahili
│   │
│   ├── app.js                  # Express app setup
│   └── server.js               # Server entry point
│
├── scripts/
│   └── seed.js                 # Database seeding
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example                # Environment template
├── .eslintrc.js                # ESLint config
├── .gitignore
├── package.json
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16+ ([Download](https://nodejs.org/))
- **MongoDB** 4.4+ ([Download](https://www.mongodb.com/try/download/community))
- **Redis** 6+ ([Download](https://redis.io/download))

### Installation

1. **Clone and navigate**
```bash
git clone <repository-url>
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/matatu-tracker
JWT_SECRET=your_super_secret_key_here
REDIS_HOST=localhost
REDIS_PORT=6379
MPESA_CONSUMER_KEY=your_mpesa_key
MPESA_CONSUMER_SECRET=your_mpesa_secret
CORS_ORIGIN=http://localhost:3000
```

4. **Start MongoDB and Redis**
```bash
# MongoDB
mongod --dbpath /path/to/data

# Redis
redis-server
```

5. **Seed database (optional)**
```bash
npm run seed
```

6. **Start development server**
```bash
npm run dev
```

Server runs at: **http://localhost:5000**

### Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests
npm run test:watch # Run tests in watch mode
npm run lint       # Run ESLint
npm run seed       # Seed database
```

## 📡 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://api.matpulse254.com/api
```

### Authentication

All authenticated requests require a JWT token in the header:
```
Authorization: Bearer <token>
```

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "+254712345678",
  "password": "securePassword123",
  "role": "passenger"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "phone": "+254712345678",
  "password": "securePassword123"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

#### Verify Phone
```http
POST /api/auth/verify-phone
Content-Type: application/json
Authorization: Bearer <token>

{
  "code": "123456"
}

Response: 200 OK
{
  "success": true,
  "message": "Phone verified successfully"
}
```

### Passenger Endpoints

#### Get Routes
```http
GET /api/passenger/routes?search=westlands&limit=20
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "_id": "route_id",
      "name": "CBD to Westlands",
      "stages": [...],
      "activeTrips": 5
    }
  ]
}
```

#### Get Route Trips
```http
GET /api/passenger/routes/:routeId/trips
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "_id": "trip_id",
      "route": {...},
      "vehicle": {...},
      "driver": {...},
      "currentLocation": {
        "type": "Point",
        "coordinates": [36.8219, -1.2921]
      },
      "status": "active",
      "crowdLevel": "half",
      "eta": "5 minutes"
    }
  ]
}
```

#### Create Reservation
```http
POST /api/passenger/reservations
Content-Type: application/json
Authorization: Bearer <token>

{
  "tripId": "trip_id_here",
  "pickupStageId": "stage_id",
  "dropoffStageId": "stage_id",
  "seats": 1
}

Response: 201 Created
{
  "success": true,
  "data": {
    "reservation": {...},
    "paymentUrl": "mpesa_payment_url"
  }
}
```

### Driver Endpoints

#### Start Trip
```http
POST /api/driver/trips/start
Content-Type: application/json
Authorization: Bearer <token>

{
  "routeId": "route_id",
  "vehicleId": "vehicle_id",
  "scheduledDeparture": "2024-01-15T08:00:00Z"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "trip": {...}
  }
}
```

#### Update Location
```http
PUT /api/driver/trips/:tripId/location
Content-Type: application/json
Authorization: Bearer <token>

{
  "coordinates": [36.8219, -1.2921],
  "heading": 45,
  "speed": 40
}

Response: 200 OK
{
  "success": true,
  "message": "Location updated"
}
```

#### Update Crowd Level
```http
PUT /api/driver/trips/:tripId/crowd
Content-Type: application/json
Authorization: Bearer <token>

{
  "crowdLevel": "high",
  "currentPassengers": 12
}

Response: 200 OK
```

#### Get Earnings
```http
GET /api/driver/earnings?period=week
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "totalEarnings": 45000,
    "tripsCompleted": 28,
    "averagePerTrip": 1607,
    "dailyBreakdown": [...]
  }
}
```

### Sacco Admin Endpoints

#### Dashboard Stats
```http
GET /api/sacco/dashboard
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "totalVehicles": 50,
    "activeTrips": 23,
    "todayRevenue": 125000,
    "weeklyRevenue": 850000,
    "topRoutes": [...],
    "vehicleUtilization": 0.85
  }
}
```

#### Get Vehicles
```http
GET /api/sacco/vehicles?status=active
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "_id": "vehicle_id",
      "registration": "KCA 123A",
      "capacity": 14,
      "currentDriver": {...},
      "status": "active",
      "lastLocation": {...}
    }
  ]
}
```

#### Revenue Analytics
```http
GET /api/sacco/analytics/revenue?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "totalRevenue": 2500000,
    "byRoute": [...],
    "byDriver": [...],
    "byVehicle": [...],
    "trends": [...]
  }
}
```

### Payment Endpoints

#### Initiate M-Pesa Payment
```http
POST /api/payments/mpesa/stk-push
Content-Type: application/json
Authorization: Bearer <token>

{
  "amount": 100,
  "phoneNumber": "+254712345678",
  "accountReference": "reservation_id"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "checkoutRequestId": "ws_CO_123456",
    "merchantRequestId": "12345-67890",
    "responseCode": "0",
    "responseDescription": "Success"
  }
}
```

#### Check Payment Status
```http
GET /api/payments/status/:checkoutRequestId
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "status": "completed",
    "amount": 100,
    "mpesaReceiptNumber": "NEF61H8S2M"
  }
}
```

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  phone: String (unique, indexed),
  email: String,
  password: String (hashed),
  role: ['passenger', 'driver', 'sacco_admin'],
  isPhoneVerified: Boolean,
  profile: {
    avatar: String,
    preferences: Object
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Trip Model
```javascript
{
  route: ObjectId (ref: 'Route'),
  vehicle: ObjectId (ref: 'Vehicle'),
  driver: ObjectId (ref: 'User'),
  status: ['scheduled', 'boarding', 'active', 'completed', 'cancelled'],
  scheduledDeparture: Date,
  actualDeparture: Date,
  estimatedArrival: Date,
  actualArrival: Date,
  currentLocation: {
    type: 'Point',
    coordinates: [longitude, latitude]
  },
  heading: Number,
  speed: Number,
  crowdLevel: ['empty', 'low', 'half', 'high', 'full', 'standing'],
  currentPassengers: Number,
  maxCapacity: Number,
  fare: Number,
  revenue: Number,
  notes: String,
  createdBy: ObjectId,
  updatedBy: ObjectId,
  isPeakHour: Boolean,
  weatherConditions: ['clear', 'rain', 'heavy_rain', 'fog'],
  trafficConditions: ['light', 'moderate', 'heavy', 'jam'],
  createdAt: Date,
  updatedAt: Date
}

// Virtuals
durationMinutes: Number (calculated)
revenuePerPassenger: Number (calculated)

// Methods
isOnTime(): Boolean

// Indexes
route: 1
status: 1
currentLocation: '2dsphere'
scheduledDeparture: 1
```

### Route Model
```javascript
{
  name: String,
  number: String,
  sacco: ObjectId (ref: 'Sacco'),
  stages: [{
    name: String,
    location: {
      type: 'Point',
      coordinates: [longitude, latitude]
    },
    order: Number
  }],
  distance: Number (km),
  estimatedDuration: Number (minutes),
  operatingHours: {
    start: String,
    end: String
  },
  baseFare: Number,
  isActive: Boolean
}
```

### Vehicle Model
```javascript
{
  registration: String (unique),
  sacco: ObjectId (ref: 'Sacco'),
  model: String,
  capacity: Number,
  features: [String],
  status: ['active', 'maintenance', 'retired'],
  currentDriver: ObjectId (ref: 'User'),
  lastMaintenance: Date,
  nextMaintenance: Date,
  insurance: {
    provider: String,
    policyNumber: String,
    expiryDate: Date
  }
}
```

### Reservation Model
```javascript
{
  trip: ObjectId (ref: 'Trip'),
  passenger: ObjectId (ref: 'User'),
  pickupStage: ObjectId,
  dropoffStage: ObjectId,
  seats: Number,
  fare: Number,
  status: ['pending', 'confirmed', 'cancelled', 'completed'],
  payment: {
    method: String,
    status: String,
    transactionId: String,
    amount: Number
  },
  createdAt: Date
}
```

## 🔌 Real-time Events

### Socket.io Events

#### Client → Server

```javascript
// Join trip room
socket.emit('join:trip', { tripId: '...' });

// Leave trip room
socket.emit('leave:trip', { tripId: '...' });

// Update location (driver only)
socket.emit('trip:location:update', {
  tripId: '...',
  coordinates: [lng, lat],
  heading: 45,
  speed: 40
});

// Update status (driver only)
socket.emit('trip:status:update', {
  tripId: '...',
  status: 'active'
});

// Update crowd (driver only)
socket.emit('trip:crowd:update', {
  tripId: '...',
  crowdLevel: 'high',
  currentPassengers: 12
});

// Report incident
socket.emit('trip:incident:report', {
  tripId: '...',
  type: 'breakdown',
  description: '...',
  location: {...}
});
```

#### Server → Client

```javascript
// Trip updated
socket.on('trip:update', (data) => {
  console.log('Trip updated:', data);
});

// Location updated
socket.on('trip:location:update', (data) => {
  console.log('New location:', data.currentLocation);
});

// Status changed
socket.on('trip:status:update', (data) => {
  console.log('Status:', data.status);
});

// Crowd updated
socket.on('trip:crowd:update', (data) => {
  console.log('Crowd level:', data.crowdLevel);
});

// New alert
socket.on('alert:new', (data) => {
  console.log('Alert:', data.message);
});
```

## 🔧 Services

### Socket Service
```javascript
// socketService.js
const socketService = {
  initialize(io),
  emitToTrip(tripId, event, data),
  emitToRoute(routeId, event, data),
  broadcastAlert(alert)
};
```

### Trip Service
```javascript
// tripService.js
const tripService = {
  createTrip(data),
  updateTripLocation(tripId, location),
  updateTripStatus(tripId, status),
  calculateETA(trip),
  getActiveTrips(filters),
  completeTripAnalytics(tripId)
};
```

### M-Pesa Service
```javascript
// mpesaService.js
const mpesaService = {
  getAccessToken(),
  initiateSTKPush(phone, amount, reference),
  queryPaymentStatus(checkoutRequestId),
  handleCallback(data)
};
```

### ETA Service
```javascript
// etaService.js
const etaService = {
  calculateETA(trip, userLocation),
  updateETAs(tripId),
  getTrafficConditions(route)
};
```

## 🛡️ Middleware

### Authentication
```javascript
// auth.js
const protect = async (req, res, next) => {
  // Verify JWT token
  // Attach user to request
};

const authorize = (...roles) => {
  return (req, res, next) => {
    // Check user role
  };
};
```

### Validation
```javascript
// validate.js
const validateRequest = (validations) => {
  return async (req, res, next) => {
    // Run validations
    // Return errors if any
  };
};
```

### Rate Limiting
```javascript
// rateLimit.js
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

### Error Handler
```javascript
// errorHandler.js
const errorHandler = (err, req, res, next) => {
  // Log error
  // Send appropriate response
};
```

## 🧪 Testing

### Run Tests
```bash
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

### Example Test
```javascript
describe('Auth Controller', () => {
  test('should register new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        phone: '+254712345678',
        password: 'password123'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });
});
```

## 🚀 Deployment

### Production Build

1. **Set environment variables**
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=strong_production_secret
REDIS_URL=redis://...
```

2. **Start server**
```bash
npm start
```

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

```bash
docker build -t matpulse254-backend .
docker run -p 5000:5000 --env-file .env matpulse254-backend
```

### PM2 (Process Manager)

```bash
npm install -g pm2
pm2 start src/server.js --name matpulse254-api
pm2 save
pm2 startup
```

## 📊 Performance

### Caching Strategy
- Redis for session storage
- Route data cached for 5 minutes
- Trip data cached for 30 seconds
- User data cached for 10 minutes

### Database Optimization
- Indexes on frequently queried fields
- Geospatial indexes for location queries
- Compound indexes for complex queries
- Connection pooling

## 🔒 Security

- JWT with secure secret
- Password hashing with bcrypt
- Rate limiting on all endpoints
- CORS configuration
- Helmet for security headers
- Input validation and sanitization
- MongoDB injection prevention
- XSS protection

## 📝 Logging

```javascript
// Request logging
app.use(morgan('combined'));

// Custom logger
const logger = require('./utils/logger');
logger.info('Server started');
logger.error('Database error', error);
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT - See [LICENSE](../LICENSE)

---

Built with ❤️ using Node.js, Express, and MongoDB
