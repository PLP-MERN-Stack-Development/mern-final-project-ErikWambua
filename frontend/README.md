# 🎨 MatPulse254 Frontend

> A modern, responsive React application for real-time matatu tracking with PWA capabilities, built with React 18, Tailwind CSS, and Mapbox GL.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Architecture](#-architecture)
- [Components](#-components)
- [State Management](#-state-management)
- [Styling](#-styling)
- [PWA Features](#-pwa-features)
- [Performance](#-performance)
- [Testing](#-testing)
- [Deployment](#-deployment)

## ✨ Features

### Core Features
- 🗺️ **Interactive Maps** - Mapbox GL with custom markers and real-time updates
- 🔄 **Real-time Updates** - WebSocket integration for live data
- 📱 **Progressive Web App** - Installable with offline support
- 🌓 **Dark Mode** - System-aware theme switching
- 🌐 **Multi-language** - English and Swahili support
- 📍 **Geolocation** - High-accuracy GPS tracking
- 🔔 **Push Notifications** - Real-time alerts and updates
- 💾 **Offline First** - Service Worker caching strategies
- ♿ **Accessible** - WCAG 2.1 AA compliant
- 📱 **Responsive** - Mobile-first design

### User Experience
- ⚡ **Fast Loading** - Code splitting and lazy loading
- 🎨 **Smooth Animations** - Tailwind CSS animations
- 🔍 **Smart Search** - Fuzzy search with debouncing
- ⭐ **Favorites** - Save frequently used routes
- 📊 **Data Visualization** - Charts with Recharts
- 🎯 **Context-aware** - Role-based UI rendering
- 🔐 **Secure** - JWT authentication with auto-refresh

## 🛠️ Tech Stack

### Core
- **React** 18.2.0 - UI library
- **React Router** 6.15.0 - Client-side routing
- **Tailwind CSS** 3.3.3 - Utility-first CSS framework

### State Management
- **Context API** - Global state management
- **TanStack Query** 5.0.0 - Server state management
- **Local Storage** - Persistent client state
- **IndexedDB** - Offline data storage

### Maps & Geolocation
- **Mapbox GL JS** 2.15.0 - Interactive maps
- **@mapbox/mapbox-gl-geocoder** 5.0.0 - Address search
- **Geolocation API** - GPS tracking

### Real-time
- **Socket.io Client** 4.7.2 - WebSocket communication

### Forms & Validation
- **React Hook Form** 7.45.4 - Form management
- **Zod** 3.22.2 - Schema validation
- **@hookform/resolvers** 3.3.2 - Form resolvers

### UI Components
- **Lucide React** 0.294.0 - Icon library
- **Recharts** 2.9.3 - Charts and graphs
- **React Hot Toast** 2.4.1 - Notifications
- **React Intersection Observer** 9.5.3 - Lazy loading

### PWA & Performance
- **Workbox** 6.6.0 - Service Worker tools
- **React Helmet Async** 1.3.0 - SEO optimization
- **date-fns** 2.30.0 - Date utilities

### Development
- **ESLint** 8.38.0 - Code linting
- **Prettier** - Code formatting
- **Jest** - Unit testing
- **React Testing Library** - Component testing

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html              # HTML template
│   ├── manifest.json           # PWA manifest
│   ├── service-worker.js       # Service Worker
│   ├── robots.txt              # SEO robots file
│   ├── logo192.png             # App icon (192x192)
│   └── logo512.png             # App icon (512x512)
│
├── src/
│   ├── components/             # React components
│   │   ├── common/             # Shared components
│   │   │   ├── Layout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── BottomNavigation.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── OfflineIndicator.jsx
│   │   │   ├── NetworkStatus.jsx
│   │   │   ├── BackButton.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── MapControls.jsx
│   │   │   ├── ShareButton.jsx
│   │   │   └── InstallPrompt.jsx
│   │   │
│   │   ├── passenger/          # Passenger components
│   │   │   ├── LiveMap.jsx
│   │   │   ├── StageList.jsx
│   │   │   ├── RouteCard.jsx
│   │   │   ├── TripCard.jsx
│   │   │   ├── ETACountdown.jsx
│   │   │   ├── ReservationModal.jsx
│   │   │   ├── AlertCard.jsx
│   │   │   ├── CapacityIndicator.jsx
│   │   │   ├── MapLegend.jsx
│   │   │   ├── RouteSearch.jsx
│   │   │   ├── StageMarker.jsx
│   │   │   └── VehicleMarker.jsx
│   │   │
│   │   ├── driver/             # Driver components
│   │   │   ├── DriverMap.jsx
│   │   │   ├── TripControls.jsx
│   │   │   ├── EarningsCard.jsx
│   │   │   ├── DriverStatus.jsx
│   │   │   ├── VehicleInfo.jsx
│   │   │   ├── RouteSelector.jsx
│   │   │   ├── PassengerList.jsx
│   │   │   ├── EmergencyButton.jsx
│   │   │   └── DriverNavigation.jsx
│   │   │
│   │   └── admin/              # Admin components
│   │       ├── FleetMonitor.jsx
│   │       ├── RevenueChart.jsx
│   │       ├── DashboardStats.jsx
│   │       ├── DriverScorecard.jsx
│   │       ├── VehicleCard.jsx
│   │       ├── AlertManager.jsx
│   │       ├── BulkMessenger.jsx
│   │       ├── ReportGenerator.jsx
│   │       └── UserManager.jsx
│   │
│   ├── contexts/               # React Context providers
│   │   ├── AuthContext.jsx     # Authentication state
│   │   ├── SocketContext.jsx   # WebSocket connection
│   │   ├── MapContext.jsx      # Map instance & state
│   │   ├── ThemeContext.jsx    # Theme (light/dark)
│   │   ├── LanguageContext.jsx # i18n language
│   │   └── OfflineContext.jsx  # Network status
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.js          # Authentication
│   │   ├── useSocket.js        # WebSocket
│   │   ├── useMap.js           # Map interactions
│   │   ├── useGeolocation.js   # GPS location
│   │   ├── useOrientation.js   # Device orientation
│   │   ├── useNetwork.js       # Network status
│   │   ├── useBattery.js       # Battery status
│   │   ├── useVibration.js     # Haptic feedback
│   │   ├── useClipboard.js     # Clipboard API
│   │   ├── useLocalStorage.js  # Local storage
│   │   ├── useDebounce.js      # Debounced values
│   │   └── useIntersection.js  # Intersection observer
│   │
│   ├── pages/                  # Route pages
│   │   ├── Landing.jsx         # Landing page
│   │   │
│   │   ├── auth/               # Authentication pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── VerifyPhone.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── ResetPassword.jsx
│   │   │
│   │   ├── passenger/          # Passenger pages
│   │   │   ├── PassengerHome.jsx
│   │   │   ├── RouteView.jsx
│   │   │   ├── TripDetails.jsx
│   │   │   ├── Alerts.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Favorites.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── History.jsx
│   │   │   └── Settings.jsx
│   │   │
│   │   ├── driver/             # Driver pages
│   │   │   ├── DriverLogin.jsx
│   │   │   ├── DriverDashboard.jsx
│   │   │   ├── ActiveTrip.jsx
│   │   │   ├── DriverEarnings.jsx
│   │   │   ├── DriverProfile.jsx
│   │   │   └── DriverSettings.jsx
│   │   │
│   │   ├── admin/              # Admin pages
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── FleetManagement.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── AdminDrivers.jsx
│   │   │   ├── Communications.jsx
│   │   │   └── Settings.jsx
│   │   │
│   │   └── public/             # Public pages
│   │       ├── About.jsx
│   │       ├── Contact.jsx
│   │       ├── Privacy.jsx
│   │       ├── Terms.jsx
│   │       └── NotFound.jsx
│   │
│   ├── services/               # API & external services
│   │   ├── api.js              # Axios instance
│   │   ├── auth.js             # Auth API calls
│   │   ├── trips.js            # Trips API calls
│   │   ├── routes.js           # Routes API calls
│   │   ├── payments.js         # Payments API calls
│   │   ├── analytics.js        # Analytics tracking
│   │   ├── cache.js            # Caching layer
│   │   ├── storage.js          # Storage management
│   │   └── geolocation.js      # GPS services
│   │
│   ├── utils/                  # Utility functions
│   │   ├── helpers.js          # General helpers
│   │   ├── constants.js        # App constants
│   │   ├── validators.js       # Validation functions
│   │   ├── logger.js           # Logging utility
│   │   ├── formatters.js       # Data formatters
│   │   └── reportWebVitals.js  # Performance monitoring
│   │
│   ├── config/                 # Configuration files
│   │   ├── routes.js           # Route definitions
│   │   ├── settings.js         # App settings
│   │   ├── mapbox.js           # Mapbox config
│   │   └── mpesa.js            # M-Pesa config
│   │
│   ├── styles/                 # CSS files
│   │   ├── globals.css         # Global styles
│   │   ├── animations.css      # Custom animations
│   │   ├── responsive.css      # Media queries
│   │   ├── theme.js            # Theme variables
│   │   └── MapboxOverrides.css # Mapbox style overrides
│   │
│   ├── App.js                  # Main App component
│   ├── index.js                # Entry point
│   ├── serviceWorkerRegistration.js  # SW registration
│   └── setupTests.js           # Test configuration
│
├── .env.example                # Environment variables template
├── .eslintrc.js                # ESLint configuration
├── .prettierrc                 # Prettier configuration
├── jsconfig.json               # Path aliases
├── package.json                # Dependencies
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind configuration
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Backend API running (see backend README)

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_MAPBOX_TOKEN=your_mapbox_token_here
REACT_APP_GA_ID=your_google_analytics_id
REACT_APP_ANALYTICS_ENABLED=true
```

3. **Start development server**
```bash
npm start
```

App runs at: http://localhost:3000

### Available Scripts

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run test:coverage  # Run tests with coverage
npm run lint       # Run ESLint
npm run format     # Format with Prettier
npm run analyze    # Analyze bundle size
```

## 🏗️ Architecture

### Context Providers Hierarchy

```jsx
<ErrorBoundary>
  <HelmetProvider>
    <QueryClientProvider>
      <LanguageProvider>
        <ThemeProvider>
          <OfflineProvider>
            <AuthProvider>
              <SocketProvider>
                <Router>
                  <App />
                </Router>
              </SocketProvider>
            </AuthProvider>
          </OfflineProvider>
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </HelmetProvider>
</ErrorBoundary>
```

### Data Flow

```
User Action
    ↓
Component
    ↓
Custom Hook (useAuth, useSocket, etc.)
    ↓
Context / TanStack Query
    ↓
Service Layer (API calls)
    ↓
Backend API
    ↓
Response → Cache → Context → Component → UI Update
```

### Real-time Updates Flow

```
Backend Event
    ↓
Socket.io Server
    ↓
SocketContext (client)
    ↓
Event Listeners
    ↓
State Update (Context/Query)
    ↓
Component Re-render
    ↓
UI Update
```

## 🧩 Components

### Common Components

#### Layout
```jsx
<Layout>
  {/* Provides app shell with sidebar, header, and content area */}
  <Outlet />
</Layout>
```

#### ProtectedRoute
```jsx
<ProtectedRoute allowedRoles={['passenger']}>
  <PassengerHome />
</ProtectedRoute>
```

#### LoadingSpinner
```jsx
<LoadingSpinner 
  fullScreen={true}
  size="large"
  message="Loading trips..."
/>
```

### Passenger Components

#### LiveMap
```jsx
<LiveMap
  trips={trips}
  selectedTrip={selectedTrip}
  onTripSelect={handleTripSelect}
  userLocation={userLocation}
/>
```

#### RouteCard
```jsx
<RouteCard
  route={route}
  onClick={() => navigate(`/route/${route._id}`)}
  showETA={true}
/>
```

### Custom Hooks Usage

```jsx
// Authentication
const { user, login, logout, isLoading } = useAuth();

// WebSocket
const { socket, connected, emit, on } = useSocket();

// Geolocation
const { location, error, startWatching } = useGeolocation({
  enableHighAccuracy: true,
  timeout: 5000
});

// Map
const { map, flyTo, fitBounds, addMarker } = useMap();
```

## 🎨 Styling

### Tailwind CSS

The app uses Tailwind CSS with custom configurations:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'kenyan-red': '#ED1C24',
        'kenyan-green': '#006600',
        'matatu-yellow': '#F7B731',
      },
      // ... custom extensions
    }
  }
}
```

### Custom CSS Classes

```css
/* Buttons */
.btn-primary     /* Kenyan red button */
.btn-secondary   /* Kenyan green button */
.btn-outline     /* Outlined button */
.btn-ghost       /* Ghost button */

/* Cards */
.card            /* Standard card */
.card-interactive /* Clickable card */

/* Forms */
.input-field     /* Standard input */
.input-error     /* Error state input */

/* Badges */
.badge-success   /* Green badge */
.badge-warning   /* Yellow badge */
.badge-error     /* Red badge */

/* Animations */
.animate-drive   /* Matatu driving animation */
.animate-float   /* Floating animation */
.animate-vibrate /* Vibration effect */
```

### Theme Variables

```css
:root {
  --color-kenyan-red: #ED1C24;
  --color-kenyan-green: #006600;
  --color-kenyan-black: #000000;
  --color-matatu-yellow: #F7B731;
  --color-pulse-orange: #FF9800;
  --color-nairobi-blue: #1E40AF;
}
```

## 💾 State Management

### Context API

```jsx
// AuthContext
const { user, login, logout, updateProfile } = useAuth();

// SocketContext
const { socket, connected, joinTrip, leaveTrip } = useSocket();

// ThemeContext
const { theme, toggleTheme, isDark } = useTheme();

// OfflineContext
const { isOnline, queueAction, processQueue } = useOffline();
```

### TanStack Query

```jsx
// Fetch trips
const { data: trips, isLoading, error, refetch } = useQuery({
  queryKey: ['trips', routeId],
  queryFn: () => tripService.getTrips(routeId),
  staleTime: 30000, // 30 seconds
});

// Mutation
const mutation = useMutation({
  mutationFn: createReservation,
  onSuccess: () => {
    queryClient.invalidateQueries(['reservations']);
    toast.success('Reservation created!');
  },
});
```

### Local Storage

```jsx
// Using custom hook
const [favorites, setFavorites] = useLocalStorage('favorites', []);

// Direct usage
import { storage } from '@/services/storage';
storage.setLocal('theme', 'dark');
const theme = storage.getLocal('theme');
```

## 📱 PWA Features

### Service Worker

The app includes a comprehensive service worker with:

- **App Shell Caching** - Fast initial load
- **API Caching** - NetworkFirst with 5-minute expiration
- **Mapbox Tiles** - CacheFirst with 30-day expiration
- **Image Caching** - CacheFirst with 30-day expiration
- **Background Sync** - Offline action queuing
- **Push Notifications** - Real-time alerts

### Offline Functionality

```jsx
// Queue actions when offline
const { queueAction, isOnline } = useOffline();

const createReservation = async (data) => {
  if (!isOnline) {
    queueAction('createReservation', data);
    toast.info('Queued for when you\'re back online');
    return;
  }
  // Normal API call
};
```

### Installation Prompt

```jsx
<InstallPrompt
  appName="MatPulse254"
  onInstall={() => console.log('App installed')}
  onDismiss={() => console.log('Installation dismissed')}
/>
```

## ⚡ Performance

### Code Splitting

```jsx
// Lazy load pages
const PassengerHome = lazy(() => import('./pages/passenger/PassengerHome'));

// Use with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <PassengerHome />
</Suspense>
```

### Optimization Techniques

- **Lazy Loading** - Route-based code splitting
- **Memoization** - React.memo, useMemo, useCallback
- **Virtual Lists** - For long lists of trips/routes
- **Image Optimization** - Lazy loading with Intersection Observer
- **Debouncing** - Search inputs and API calls
- **Throttling** - GPS updates and scroll events
- **Bundle Analysis** - Regular size monitoring

### Performance Monitoring

```jsx
// Web Vitals
import { reportWebVitals } from './utils/reportWebVitals';

reportWebVitals(console.log);
// Logs: CLS, FID, FCP, LCP, TTFB
```

## 🧪 Testing

### Unit Tests

```bash
npm test
```

```jsx
// Example test
import { render, screen } from '@testing-library/react';
import RouteCard from './RouteCard';

test('renders route card with name', () => {
  const route = { name: 'CBD to Westlands' };
  render(<RouteCard route={route} />);
  expect(screen.getByText('CBD to Westlands')).toBeInTheDocument();
});
```

### Integration Tests

```jsx
import { renderHook } from '@testing-library/react-hooks';
import { useAuth } from './hooks/useAuth';

test('login updates user state', async () => {
  const { result } = renderHook(() => useAuth());
  await act(async () => {
    await result.current.login({ phone: '+254712345678', password: 'test' });
  });
  expect(result.current.user).toBeTruthy();
});
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables (Production)

```env
REACT_APP_API_URL=https://api.matpulse254.com/api
REACT_APP_SOCKET_URL=https://api.matpulse254.com
REACT_APP_MAPBOX_TOKEN=pk.xxx
REACT_APP_GA_ID=UA-xxx
REACT_APP_ANALYTICS_ENABLED=true
```

### Deploy to Vercel

```bash
vercel
```

### Deploy to Netlify

```bash
netlify deploy --prod
```

### Nginx Configuration

```nginx
server {
  listen 80;
  server_name matpulse254.com;
  root /var/www/matpulse254/build;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /api {
    proxy_pass http://localhost:5000;
  }
}
```

## 📊 Bundle Size

Target bundle sizes:
- Main bundle: < 200KB (gzipped)
- Vendor bundle: < 150KB (gzipped)
- Total: < 350KB (gzipped)

## 🔧 Configuration Files

### jsconfig.json (Path Aliases)

```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"],
      "@components/*": ["components/*"],
      "@hooks/*": ["hooks/*"],
      "@services/*": ["services/*"],
      "@utils/*": ["utils/*"]
    }
  }
}
```

Usage:
```jsx
import { useAuth } from '@/hooks/useAuth';
import Button from '@components/common/Button';
```

## 📝 Best Practices

1. **Component Organization**
   - Keep components small and focused
   - Use composition over inheritance
   - Extract reusable logic into custom hooks

2. **State Management**
   - Use Context for global state
   - Use TanStack Query for server state
   - Use local state for UI state

3. **Performance**
   - Memoize expensive calculations
   - Lazy load routes and heavy components
   - Optimize images and assets

4. **Accessibility**
   - Use semantic HTML
   - Add ARIA labels
   - Ensure keyboard navigation

5. **Security**
   - Never store sensitive data in localStorage
   - Sanitize user inputs
   - Use environment variables for secrets

## 🐛 Troubleshooting

### Map Not Loading
- Check Mapbox token in .env
- Verify token has correct permissions
- Check browser console for errors

### Socket Connection Failed
- Verify backend is running
- Check SOCKET_URL in .env
- Check CORS configuration in backend

### Build Fails
- Clear node_modules and reinstall
- Check for outdated dependencies
- Verify Node.js version (16+)

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)
- [Socket.io Client](https://socket.io/docs/v4/client-api/)
- [TanStack Query](https://tanstack.com/query/latest)

## 🤝 Contributing

See main [CONTRIBUTING.md](../CONTRIBUTING.md)

## 📄 License

MIT - See [LICENSE](../LICENSE)

---

Built with ❤️ using React and Tailwind CSS
