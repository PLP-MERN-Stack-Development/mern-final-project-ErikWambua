// Analytics Service for tracking user events and metrics

class AnalyticsService {
  constructor() {
    this.isEnabled = process.env.REACT_APP_ANALYTICS_ENABLED === 'true';
    this.events = [];
  }

  // Initialize analytics
  init() {
    if (!this.isEnabled) return;
    
    // Initialize Google Analytics or other analytics service
    if (window.gtag) {
      window.gtag('js', new Date());
      window.gtag('config', process.env.REACT_APP_GA_ID);
    }
  }

  // Track page view
  pageView(path, title) {
    if (!this.isEnabled) return;

    try {
      if (window.gtag) {
        window.gtag('config', process.env.REACT_APP_GA_ID, {
          page_path: path,
          page_title: title
        });
      }

      this.logEvent('page_view', { path, title });
    } catch (error) {
      console.error('Analytics pageView error:', error);
    }
  }

  // Track custom event
  trackEvent(eventName, eventParams = {}) {
    if (!this.isEnabled) return;

    try {
      if (window.gtag) {
        window.gtag('event', eventName, eventParams);
      }

      this.logEvent(eventName, eventParams);
    } catch (error) {
      console.error('Analytics trackEvent error:', error);
    }
  }

  // Track user action
  trackAction(category, action, label = '', value = 0) {
    this.trackEvent('user_action', {
      event_category: category,
      event_action: action,
      event_label: label,
      value: value
    });
  }

  // Track trip events
  trackTripEvent(eventType, tripData) {
    this.trackEvent(`trip_${eventType}`, {
      trip_id: tripData.id,
      route: tripData.routeName,
      duration: tripData.duration
    });
  }

  // Track errors
  trackError(error, errorInfo = {}) {
    this.trackEvent('error', {
      error_message: error.message,
      error_stack: error.stack?.substring(0, 500),
      ...errorInfo
    });
  }

  // Track timing
  trackTiming(category, variable, time, label = '') {
    this.trackEvent('timing_complete', {
      name: category,
      value: time,
      event_category: category,
      event_label: label
    });
  }

  // Set user properties
  setUserProperties(properties) {
    if (!this.isEnabled) return;

    try {
      if (window.gtag) {
        window.gtag('set', 'user_properties', properties);
      }
    } catch (error) {
      console.error('Analytics setUserProperties error:', error);
    }
  }

  // Set user ID
  setUserId(userId) {
    if (!this.isEnabled) return;

    try {
      if (window.gtag) {
        window.gtag('set', { user_id: userId });
      }
    } catch (error) {
      console.error('Analytics setUserId error:', error);
    }
  }

  // Log event locally (for debugging)
  logEvent(eventName, eventParams) {
    const event = {
      name: eventName,
      params: eventParams,
      timestamp: new Date().toISOString()
    };

    this.events.push(event);

    // Keep only last 100 events
    if (this.events.length > 100) {
      this.events.shift();
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', event);
    }
  }

  // Get logged events
  getEvents() {
    return this.events;
  }

  // Clear events
  clearEvents() {
    this.events = [];
  }
}

const analyticsService = new AnalyticsService();
export default analyticsService;
