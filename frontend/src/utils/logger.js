/**
 * Logger utility for development and production
 * Helps with debugging and error tracking
 */

const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

const isDevelopment = process.env.NODE_ENV === 'development';

class Logger {
  constructor(context = 'App') {
    this.context = context;
  }

  /**
   * Format log message with context and timestamp
   */
  formatMessage(level, message, data) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${this.context}] [${level.toUpperCase()}]`;
    
    if (data) {
      return { prefix, message, data };
    }
    return { prefix, message };
  }

  /**
   * Log error message
   */
  error(message, error = null) {
    const { prefix } = this.formatMessage(LOG_LEVELS.ERROR, message);
    console.error(prefix, message, error);
    
    // Send to error tracking service in production
    if (!isDevelopment && error) {
      this.sendToErrorTracking(message, error);
    }
  }

  /**
   * Log warning message
   */
  warn(message, data = null) {
    const { prefix } = this.formatMessage(LOG_LEVELS.WARN, message, data);
    console.warn(prefix, message, data || '');
  }

  /**
   * Log info message
   */
  info(message, data = null) {
    const { prefix } = this.formatMessage(LOG_LEVELS.INFO, message, data);
    console.log(prefix, message, data || '');
  }

  /**
   * Log debug message (only in development)
   */
  debug(message, data = null) {
    if (!isDevelopment) return;
    
    const { prefix } = this.formatMessage(LOG_LEVELS.DEBUG, message, data);
    console.log(prefix, message, data || '');
  }

  /**
   * Log API request
   */
  logRequest(method, url, data = null) {
    if (!isDevelopment) return;
    
    console.group(`🌐 API ${method.toUpperCase()} ${url}`);
    if (data) {
      console.log('Request Data:', data);
    }
    console.groupEnd();
  }

  /**
   * Log API response
   */
  logResponse(method, url, status, data = null) {
    if (!isDevelopment) return;
    
    const emoji = status >= 200 && status < 300 ? '✅' : '❌';
    console.group(`${emoji} API ${method.toUpperCase()} ${url} (${status})`);
    if (data) {
      console.log('Response Data:', data);
    }
    console.groupEnd();
  }

  /**
   * Log socket event
   */
  logSocketEvent(event, data = null) {
    if (!isDevelopment) return;
    
    console.group(`🔌 Socket Event: ${event}`);
    if (data) {
      console.log('Event Data:', data);
    }
    console.groupEnd();
  }

  /**
   * Log performance metric
   */
  logPerformance(label, duration) {
    if (!isDevelopment) return;
    
    console.log(`⏱️ Performance: ${label} took ${duration.toFixed(2)}ms`);
  }

  /**
   * Start performance timer
   */
  startTimer(label) {
    if (!isDevelopment) return null;
    
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.logPerformance(label, duration);
      return duration;
    };
  }

  /**
   * Send error to tracking service (placeholder)
   */
  sendToErrorTracking(message, error) {
    // TODO: Integrate with error tracking service like Sentry
    // Example:
    // Sentry.captureException(error, {
    //   tags: { context: this.context },
    //   extra: { message }
    // });
  }
}

// Create default logger instance
export const logger = new Logger();

// Export Logger class for custom instances
export default Logger;

// Export convenience methods
export const createLogger = (context) => new Logger(context);

// Example usage:
// import { logger, createLogger } from '@/utils/logger';
//
// // Using default logger
// logger.info('User logged in', { userId: '123' });
// logger.error('Failed to fetch data', error);
//
// // Using context-specific logger
// const apiLogger = createLogger('API');
// apiLogger.logRequest('GET', '/api/trips');
// apiLogger.logResponse('GET', '/api/trips', 200, data);
//
// // Performance tracking
// const endTimer = logger.startTimer('Data processing');
// // ... do work ...
// endTimer(); // Logs: "Performance: Data processing took XXms"
