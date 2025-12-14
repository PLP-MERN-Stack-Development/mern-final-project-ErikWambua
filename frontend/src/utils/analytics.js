// Analytics utility for tracking user events and behavior

class AnalyticsService {
  constructor() {
    this.enabled = process.env.NODE_ENV === 'production';
    this.queue = [];
    this.userId = null;
  }

  /**
   * Initialize analytics
   */
  init(userId = null) {
    this.userId = userId;
    
    // Initialize third-party analytics (e.g., Google Analytics, Mixpanel)
    if (this.enabled && window.gtag) {
      window.gtag('config', process.env.REACT_APP_GA_TRACKING_ID, {
        user_id: userId
      });
    }
  }

  /**
   * Track page view
   */
  pageView(path, title = '') {
    if (!this.enabled) {
      console.log('📊 Page View:', path, title);
      return;
    }

    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title
      });
    }
  }

  /**
   * Track custom event
   */
  track(eventName, properties = {}) {
    if (!this.enabled) {
      console.log('📊 Event:', eventName, properties);
      return;
    }

    if (window.gtag) {
      window.gtag('event', eventName, properties);
    }
  }

  /**
   * Track user action
   */
  trackAction(action, category, label = '', value = null) {
    this.track(action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }

  /**
   * Track trip events
   */
  trackTrip(event, tripData = {}) {
    const events = {
      search: 'trip_search',
      view: 'trip_view',
      reserve: 'trip_reserve',
      start: 'trip_start',
      complete: 'trip_complete',
      cancel: 'trip_cancel'
    };

    this.track(events[event] || event, {
      trip_id: tripData.tripId,
      route_id: tripData.routeId,
      ...tripData
    });
  }

  /**
   * Track payment events
   */
  trackPayment(event, paymentData = {}) {
    const events = {
      initiate: 'payment_initiated',
      success: 'payment_success',
      failed: 'payment_failed'
    };

    this.track(events[event] || event, {
      payment_method: paymentData.method,
      amount: paymentData.amount,
      currency: 'KES',
      ...paymentData
    });
  }

  /**
   * Track search
   */
  trackSearch(query, category = 'general', results = 0) {
    this.track('search', {
      search_term: query,
      search_category: category,
      results_count: results
    });
  }

  /**
   * Track error
   */
  trackError(error, context = {}) {
    if (!this.enabled) {
      console.error('📊 Error:', error, context);
      return;
    }

    this.track('error', {
      error_message: error.message || error,
      error_stack: error.stack,
      ...context
    });

    // Send to error tracking service (e.g., Sentry)
    if (window.Sentry) {
      window.Sentry.captureException(error, { extra: context });
    }
  }

  /**
   * Track timing/performance
   */
  trackTiming(category, variable, time, label = '') {
    if (!this.enabled) {
      console.log(`📊 Timing: ${category}.${variable} = ${time}ms`, label);
      return;
    }

    if (window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: variable,
        value: time,
        event_category: category,
        event_label: label
      });
    }
  }

  /**
   * Track user engagement
   */
  trackEngagement(type, duration = 0) {
    this.track('user_engagement', {
      engagement_type: type,
      engagement_time: duration
    });
  }

  /**
   * Set user properties
   */
  setUserProperties(properties = {}) {
    if (!this.enabled) {
      console.log('📊 User Properties:', properties);
      return;
    }

    if (window.gtag) {
      window.gtag('set', 'user_properties', properties);
    }
  }

  /**
   * Track conversion
   */
  trackConversion(conversionId, value = 0) {
    if (!this.enabled) return;

    if (window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: conversionId,
        value: value,
        currency: 'KES'
      });
    }
  }
}

// Create singleton instance
const analyticsService = new AnalyticsService();

export default analyticsService;

// Export individual methods for convenience
export const {
  init,
  pageView,
  track,
  trackAction,
  trackTrip,
  trackPayment,
  trackSearch,
  trackError,
  trackTiming,
  trackEngagement,
  setUserProperties,
  trackConversion
} = analyticsService;
