# 🚐 MatPulse254 - Real-Time Matatu Tracking Platform

[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-green.svg)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.5-black.svg)](https://socket.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> A comprehensive real-time public transport tracking system for Kenyan matatus (public service vehicles), providing live location updates, crowd levels, ETAs, and seamless M-Pesa payment integration.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Documentation](#-documentation)
- [API Reference](#-api-reference)
- [Screenshots](#-screenshots)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### For Passengers
- 🗺️ **Real-time Tracking** - Live GPS tracking of matatus on interactive maps
- ⏱️ **Accurate ETAs** - Precise arrival time predictions based on traffic
- 👥 **Crowd Levels** - Real-time passenger count and available seats
- 💺 **Seat Reservations** - Reserve seats in advance
- 💳 **M-Pesa Integration** - Seamless mobile payments
- 🔔 **Smart Alerts** - Route disruptions, incidents, and ETA notifications
- ⭐ **Favorite Routes** - Save frequently used routes
- 📱 **PWA Support** - Install as mobile app with offline capabilities

### For Drivers
- 🚗 **Trip Management** - Start, pause, and complete trips
- 📍 **Location Sharing** - Automatic GPS tracking
- 💰 **Earnings Tracking** - Real-time revenue monitoring
- 👨‍👩‍👧‍👦 **Passenger Management** - Update crowd levels and capacity
- 🚨 **Emergency Alerts** - Quick incident reporting
- 📊 **Performance Analytics** - Daily/weekly earnings and stats

### For Sacco Admins
- 🚌 **Fleet Management** - Monitor all vehicles in real-time
- 📈 **Analytics Dashboard** - Revenue, trips, and performance metrics
- 👥 **Driver Management** - Track driver performance and compliance
- 💬 **Bulk Messaging** - Send notifications to drivers/passengers
- 📊 **Report Generation** - Custom reports and data exports
- 🎯 **Route Optimization** - Analyze route efficiency

### Technical Features
- 🔄 **Real-time Updates** - WebSocket-based live data synchronization
- 🌐 **Offline First** - Service Worker caching for offline functionality
- 🔐 **Secure Authentication** - JWT-based auth with phone verification
- 📱 **Responsive Design** - Mobile-first, works on all devices
- 🌍 **Geolocation Services** - High-accuracy GPS tracking
- 💾 **Redis Caching** - Fast data retrieval and session management
- 🎨 **Dark Mode** - System-aware theme switching
- 🌐 **Multi-language** - English and Swahili support

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js 16+
- **Framework:** Express.js 4.18
- **Database:** MongoDB 4.4+ with Mongoose ODM
- **Real-time:** Socket.io 4.5
- **Caching:** Redis 4.6
- **Authentication:** JWT (jsonwebtoken 9.0)
- **Payments:** M-Pesa Daraja API
- **Validation:** Express Validator 6.14
- **Security:** Helmet, CORS, Rate Limiting
- **Geospatial:** Geolib 3.3, GeoJSON

### Frontend
- **Framework:** React 18.2
- **Routing:** React Router v6
- **State Management:** Context API + TanStack Query 5.0
- **Styling:** Tailwind CSS 3.3
- **Maps:** Mapbox GL JS 2.15
- **Real-time:** Socket.io Client 4.7
- **Forms:** React Hook Form 7.45 + Zod 3.22
- **UI Components:** Lucide React, Recharts 2.9
- **PWA:** Workbox 6.6
- **Date Handling:** date-fns 2.30
- **Notifications:** React Hot Toast 2.4

### DevOps & Tools
- **Version Control:** Git & GitHub
- **Package Manager:** npm
- **Code Quality:** ESLint, Prettier
- **Testing:** Jest, Supertest
- **API Testing:** Postman
- **Monitoring:** Morgan (logging)
- **Containerization:** Docker (optional)

## 📁 Project Structure

```
mern-final-project-ErikWambua/
├── backend/                    # Node.js/Express backend
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   │   ├── database.js    # MongoDB connection
│   │   │   ├── redis.js       # Redis client setup
│   │   │   └── socket.js      # Socket.io configuration
│   │   ├── controllers/       # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── passengerController.js
│   │   │   ├── driverController.js
│   │   │   ├── saccoController.js
│   │   │   ├── tripController.js
│   │   │   └── paymentController.js
│   │   ├── middleware/        # Custom middleware
│   │   │   ├── auth.js        # JWT authentication
│   │   │   ├── validate.js    # Request validation
│   │   │   ├── rateLimit.js   # Rate limiting
│   │   │   └── errorHandler.js
│   │   ├── models/            # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Trip.js
│   │   │   ├── Route.js
│   │   │   ├── Vehicle.js
│   │   │   ├── Sacco.js
│   │   │   ├── Reservation.js
│   │   │   └── Alert.js
│   │   ├── routes/            # API routes
│   │   │   ├── auth.js
│   │   │   ├── passenger.js
│   │   │   ├── driver.js
│   │   │   ├── sacco.js
│   │   │   ├── trips.js
│   │   │   └── payments.js
│   │   ├── services/          # Business logic
│   │   │   ├── socketService.js
│   │   │   ├── tripService.js
│   │   │   ├── mpesaService.js
│   │   │   ├── etaService.js
│   │   │   └── notificationService.js
│   │   ├── utils/             # Utility functions
│   │   │   ├── helpers.js
│   │   │   ├── validators.js
│   │   │   ├── calculations.js
│   │   │   └── constants.js
│   │   ├── locales/           # i18n translations
│   │   │   ├── en.json
│   │   │   └── sw.json
│   │   ├── app.js             # Express app setup
│   │   └── server.js          # Server entry point
│   ├── scripts/
│   │   └── seed.js            # Database seeding
│   ├── .env.example           # Environment variables template
│   ├── package.json
│   └── README.md
│
├── frontend/                   # React frontend
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json      # PWA manifest
│   │   ├── service-worker.js  # Service worker
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── common/        # Shared components
│   │   │   ├── passenger/     # Passenger-specific
│   │   │   ├── driver/        # Driver-specific
│   │   │   └── admin/         # Admin-specific
│   │   ├── contexts/          # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   ├── SocketContext.jsx
│   │   │   ├── MapContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   ├── LanguageContext.jsx
│   │   │   └── OfflineContext.jsx
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useSocket.js
│   │   │   ├── useGeolocation.js
│   │   │   └── ...
│   │   ├── pages/             # Route pages
│   │   │   ├── auth/
│   │   │   ├── passenger/
│   │   │   ├── driver/
│   │   │   ├── admin/
│   │   │   └── public/
│   │   ├── services/          # API services
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   ├── trips.js
│   │   │   └── ...
│   │   ├── styles/            # CSS files
│   │   │   ├── globals.css
│   │   │   ├── animations.css
│   │   │   └── responsive.css
│   │   ├── utils/             # Utility functions
│   │   │   ├── helpers.js
│   │   │   ├── constants.js
│   │   │   ├── logger.js
│   │   │   └── validators.js
│   │   ├── config/            # Configuration
│   │   │   ├── routes.js
│   │   │   ├── mapbox.js
│   │   │   └── settings.js
│   │   ├── App.js             # Main App component
│   │   ├── index.js           # Entry point
│   │   └── serviceWorkerRegistration.js
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   ├── jsconfig.json          # Path aliases
│   └── README.md
│
├── docs/                       # Documentation
│   ├── API.md                 # API documentation
│   ├── SETUP.md               # Setup guide
│   └── DEPLOYMENT.md          # Deployment guide
│
├── QUICK-START.md             # Quick start guide
├── FRONTEND-REVIEW-AND-FIXES.md
├── .gitignore
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- **Node.js** 16+ ([Download](https://nodejs.org/))
- **MongoDB** 4.4+ ([Download](https://www.mongodb.com/try/download/community))
- **Redis** 6+ ([Download](https://redis.io/download))
- **Git** ([Download](https://git-scm.com/))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/PLP-MERN-Stack-Development/mern-final-project-ErikWambua.git
cd mern-final-project-ErikWambua
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run seed  # Optional: Seed database with sample data
npm run dev   # Start development server
```

3. **Frontend Setup** (in a new terminal)
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your Mapbox token and API URL
npm start     # Start development server
```

4. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/api-docs

### Environment Variables

#### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/matatu-tracker
JWT_SECRET=your_secret_key_here
REDIS_HOST=localhost
REDIS_PORT=6379
MPESA_CONSUMER_KEY=your_mpesa_key
MPESA_CONSUMER_SECRET=your_mpesa_secret
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_MAPBOX_TOKEN=your_mapbox_token
REACT_APP_ANALYTICS_ENABLED=false
```

## 📚 Documentation

- **[Quick Start Guide](./QUICK-START.md)** - Get up and running in 10 minutes
- **[Backend README](./backend/README.md)** - Backend architecture and API
- **[Frontend Setup](./FRONTEND-SETUP-GUIDE.md)** - Frontend setup and structure
- **[API Documentation](./docs/API.md)** - Complete API reference
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment

## 📡 API Reference

### Authentication Endpoints
```
POST   /api/auth/register       # Register new user
POST   /api/auth/login          # Login user
POST   /api/auth/verify-phone   # Verify phone number
GET    /api/auth/me             # Get current user
POST   /api/auth/refresh        # Refresh JWT token
```

### Passenger Endpoints
```
GET    /api/passenger/routes              # Get all routes
GET    /api/passenger/routes/:id/trips    # Get trips for route
POST   /api/passenger/reservations        # Create reservation
GET    /api/passenger/reservations        # Get user reservations
GET    /api/passenger/alerts              # Get route alerts
POST   /api/passenger/favorites           # Add favorite route
```

### Driver Endpoints
```
POST   /api/driver/trips/start            # Start new trip
PUT    /api/driver/trips/:id/location     # Update location
PUT    /api/driver/trips/:id/status       # Update trip status
PUT    /api/driver/trips/:id/crowd        # Update crowd level
POST   /api/driver/trips/:id/incident     # Report incident
GET    /api/driver/earnings               # Get earnings stats
```

### Sacco Admin Endpoints
```
GET    /api/sacco/dashboard               # Dashboard stats
GET    /api/sacco/vehicles                # Get all vehicles
POST   /api/sacco/vehicles                # Add new vehicle
GET    /api/sacco/analytics/revenue       # Revenue analytics
POST   /api/sacco/communications/bulk     # Send bulk messages
GET    /api/sacco/reports                 # Generate reports
```

### Payment Endpoints
```
POST   /api/payments/mpesa/stk-push       # Initiate M-Pesa payment
GET    /api/payments/status/:id           # Check payment status
POST   /api/payments/callback             # M-Pesa callback (webhook)
```

### WebSocket Events
```javascript
// Client to Server
'join:trip'              // Join trip room
'leave:trip'             // Leave trip room
'trip:location:update'   // Update vehicle location
'trip:status:update'     // Update trip status

// Server to Client
'trip:update'            // Trip data updated
'trip:location:update'   // Vehicle location changed
'trip:crowd:update'      // Passenger count changed
'alert:new'              // New route alert
```

## 📱 Screenshots

### Passenger Interface
| Home Screen | Route View | Trip Details |
|-------------|------------|--------------|
| ![Home](docs/screenshots/passenger-home.png) | ![Route](docs/screenshots/route-view.png) | ![Trip](docs/screenshots/trip-details.png) |

### Driver Interface
| Dashboard | Active Trip | Earnings |
|-----------|-------------|----------|
| ![Dashboard](docs/screenshots/driver-dashboard.png) | ![Trip](docs/screenshots/active-trip.png) | ![Earnings](docs/screenshots/earnings.png) |

### Admin Interface
| Fleet Monitor | Analytics | Reports |
|---------------|-----------|---------|
| ![Fleet](docs/screenshots/fleet.png) | ![Analytics](docs/screenshots/analytics.png) | ![Reports](docs/screenshots/reports.png) |

## 🚀 Deployment

### Backend Deployment (Render/Railway)
```bash
# Build command
npm install

# Start command
npm start

# Environment variables (set in dashboard)
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_production_secret
REDIS_URL=your_redis_cloud_url
```

### Frontend Deployment (Vercel/Netlify)
```bash
# Build command
npm run build

# Publish directory
build

# Environment variables
REACT_APP_API_URL=https://your-backend.com/api
REACT_APP_SOCKET_URL=https://your-backend.com
REACT_APP_MAPBOX_TOKEN=your_mapbox_token
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm test                # Run all tests
npm run test:coverage   # Coverage report
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Erik Wambua**
- GitHub: [@ErikWambua](https://github.com/ErikWambua)
- Email: erik.wambua@example.com

## 🙏 Acknowledgments

- PLP MERN Stack Development Course
- Kenyan matatu industry stakeholders
- Open source community
- Mapbox for mapping services
- Safaricom for M-Pesa API

## 📞 Support

For support, email support@matpulse254.com or create an issue in this repository.

---

<div align="center">
  <p>Built with ❤️ for the Kenyan matatu industry</p>
  <p>© 2024 MatPulse254. All rights reserved.</p>
</div>
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [GitHub Classroom Guide](https://docs.github.com/en/education/manage-coursework-with-github-classroom) 