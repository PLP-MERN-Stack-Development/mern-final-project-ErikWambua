import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';
import './styles/animations.css';
import './styles/responsive.css';
import './styles/MapboxOverrides.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './utils/reportWebVitals';
import analyticsService from './utils/analytics';

// Initialize analytics
analyticsService.init();

// Create root
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render app (App.js handles all providers and routing)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker with custom callbacks
serviceWorkerRegistration.register({
  onSuccess: (registration) => {
    console.log('✅ Service Worker registered successfully');
    analyticsService.track('sw_registered', {
      scope: registration.scope,
    });
  },
  onUpdate: (registration) => {
    console.log('🔄 New version available');
    // Show update notification to user
    if (window.confirm('A new version is available! Reload to update?')) {
      registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  },
});

// Measure performance and send to analytics
reportWebVitals((metric) => {
  if (process.env.NODE_ENV === 'production') {
    analyticsService.trackTiming(
      'web_vitals',
      metric.name,
      metric.value,
      metric.id
    );
  }
});

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  analyticsService.trackError(event.error, {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  analyticsService.trackError(event.reason, {
    type: 'unhandled_promise',
  });
});

// Log app info
console.log(
  '%cMatPulse254',
  'font-size: 24px; font-weight: bold; color: #10B981;'
);
console.log(
  '%cReal-time Matatu Tracking Platform',
  'font-size: 14px; color: #6B7280;'
);
console.log(
  `%cVersion: ${process.env.REACT_APP_VERSION || '1.0.0'}`,
  'font-size: 12px; color: #9CA3AF;'
);
console.log(
  `%cEnvironment: ${process.env.NODE_ENV}`,
  'font-size: 12px; color: #9CA3AF;'
);