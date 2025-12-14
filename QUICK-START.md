# 🚀 Quick Start Guide - MatPulse254

## Prerequisites Checklist
- [ ] Node.js 16+ installed
- [ ] MongoDB 4.4+ running
- [ ] Redis 6+ running
- [ ] Mapbox account created (for maps)
- [ ] M-Pesa developer account (for payments)

---

## Backend Setup (5 minutes)

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with minimum required values:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/matatu-tracker
JWT_SECRET=your_secret_key_change_this
REDIS_HOST=localhost
CORS_ORIGIN=http://localhost:3000
```

### 3. Seed Database (Optional)
```bash
npm run seed
```

### 4. Start Backend
```bash
npm run dev
```

✅ Backend running at: http://localhost:5000

---

## Frontend Setup (5 minutes)

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with minimum required values:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_MAPBOX_TOKEN=your_mapbox_token_here
```

### 3. Start Frontend
```bash
npm start
```

✅ Frontend running at: http://localhost:3000

---

## Test the Application

### 1. Register a User
- Navigate to: http://localhost:3000/register
- Create a passenger account
- Verify phone (use any valid Kenyan number format)

### 2. Test Passenger Features
- Browse routes
- View live trips
- Check ETAs
- Reserve seats

### 3. Test Driver Features
- Login as driver: http://localhost:3000/driver/login
- Start a trip
- Update trip status
- Track earnings

### 4. Test Admin Features
- Login as sacco admin: http://localhost:3000/admin
- View fleet dashboard
- Monitor trips
- View analytics

---

## Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
**Solution:**
```bash
# Start MongoDB
mongod --dbpath /path/to/data
```

### Issue: "Redis connection failed"
**Solution:**
```bash
# Start Redis
redis-server
```

### Issue: "Mapbox map not loading"
**Solution:**
1. Get token from: https://account.mapbox.com/
2. Add to `.env`: `REACT_APP_MAPBOX_TOKEN=pk.xxx`
3. Restart frontend

### Issue: "Socket.io connection error"
**Solution:**
1. Check backend is running on port 5000
2. Verify `REACT_APP_SOCKET_URL` in frontend `.env`
3. Check CORS_ORIGIN in backend `.env`

---

## Development Workflow

### Backend Changes
```bash
cd backend
npm run dev  # Auto-restarts on file changes
```

### Frontend Changes
```bash
cd frontend
npm start  # Hot reloads on file changes
```

### Database Reset
```bash
cd backend
# Drop database
mongo matatu-tracker --eval "db.dropDatabase()"
# Re-seed
npm run seed
```

### Clear All Caches
```bash
# Backend
rm -rf backend/node_modules
cd backend && npm install

# Frontend
rm -rf frontend/node_modules
cd frontend && npm install
```

---

## Project Structure Quick Reference

### Backend Routes
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/trips` - Get all trips
- `POST /api/trips` - Create trip
- `GET /api/routes` - Get all routes
- `POST /api/payments/initiate` - Initiate M-Pesa payment

### Frontend Routes
- `/` - Landing page
- `/login` - Login page
- `/passenger` - Passenger home
- `/driver` - Driver dashboard
- `/admin` - Admin dashboard
- `/route/:id` - Route details
- `/trip/:id` - Trip details

### Socket Events
- `join:trip` - Join trip room
- `trip:location:update` - Vehicle location update
- `trip:status:update` - Trip status change
- `trip:crowd:update` - Passenger count update
- `alert:new` - New alert broadcast

---

## Useful Commands

### Backend
```bash
npm run dev        # Start development server
npm run start      # Start production server
npm run test       # Run tests
npm run lint       # Run ESLint
npm run seed       # Seed database
```

### Frontend
```bash
npm start          # Start development server
npm run build      # Build for production
npm run test       # Run tests
npm run lint       # Run ESLint
npm run format     # Format with Prettier
```

---

## Environment Variables Reference

### Backend (Critical)
- `MONGODB_URI` - Database connection
- `JWT_SECRET` - Auth token secret
- `REDIS_HOST` - Cache server
- `CORS_ORIGIN` - Allowed frontend URL

### Frontend (Critical)
- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_SOCKET_URL` - WebSocket URL
- `REACT_APP_MAPBOX_TOKEN` - Mapbox API key

---

## Testing Accounts (After Seed)

### Passenger
- Phone: +254712345678
- Password: password123

### Driver
- Phone: +254798765432
- Password: password123

### Sacco Admin
- Email: admin@matpulse254.com
- Password: admin123

---

## Deployment Checklist

### Backend
- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT_SECRET
- [ ] Configure production MongoDB
- [ ] Set up Redis instance
- [ ] Configure M-Pesa production keys
- [ ] Set up SSL/HTTPS
- [ ] Configure proper CORS
- [ ] Set up logging service
- [ ] Configure backups

### Frontend
- [ ] Update API URLs to production
- [ ] Build production bundle: `npm run build`
- [ ] Configure CDN for static assets
- [ ] Set up SSL/HTTPS
- [ ] Configure service worker for PWA
- [ ] Set up error tracking (Sentry)
- [ ] Configure analytics
- [ ] Test on mobile devices

---

## Support & Resources

### Documentation
- Backend API Docs: `backend/README.md`
- Frontend Guide: `FRONTEND-SETUP-GUIDE.md`
- File Structure: `FRONTEND-FILES-SUMMARY.md`
- Review & Fixes: `FRONTEND-REVIEW-AND-FIXES.md`

### External Resources
- React Docs: https://react.dev/
- Express Docs: https://expressjs.com/
- Socket.io Docs: https://socket.io/docs/
- MongoDB Docs: https://docs.mongodb.com/
- Mapbox Docs: https://docs.mapbox.com/

---

## 🎉 You're Ready!

The application should now be running successfully. If you encounter any issues:
1. Check the Common Issues section above
2. Review the detailed documentation files
3. Check console logs for error messages
4. Verify all environment variables are set correctly

**Happy Coding! 🚐💨**
