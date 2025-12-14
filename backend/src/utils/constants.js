module.exports = {
  ROLES: {
    PASSENGER: 'passenger',
    DRIVER: 'driver',
    SACCO_ADMIN: 'sacco_admin',
    SUPER_ADMIN: 'super_admin'
  },

  TRIP_STATUS: {
    SCHEDULED: 'scheduled',
    BOARDING: 'boarding',
    ACTIVE: 'active',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
  },

  RESERVATION_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    BOARDED: 'boarded',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    EXPIRED: 'expired'
  },

  VEHICLE_STATUS: {
    ACTIVE: 'active',
    MAINTENANCE: 'maintenance',
    OFFLINE: 'offline',
    DECOMMISSIONED: 'decommissioned'
  },

  ALERT_TYPES: {
    POLICE: 'police',
    ACCIDENT: 'accident',
    TRAFFIC_JAM: 'traffic_jam',
    ROADBLOCK: 'roadblock',
    PROTEST: 'protest',
    FLOODING: 'flooding',
    BREAKDOWN: 'breakdown',
    OTHER: 'other'
  },

  CROWD_LEVELS: {
    EMPTY: 'empty',
    LOW: 'low',
    HALF: 'half',
    HIGH: 'high',
    FULL: 'full',
    STANDING: 'standing'
  },

  // In meters
  GEO_RADIUS: {
    NEARBY_ALERTS: 5000, // 5km
    NEARBY_VEHICLES: 2000, // 2km
    STAGE_RADIUS: 200 // 200m
  },

  // In minutes
  TIME_LIMITS: {
    RESERVATION_EXPIRY: 15,
    VERIFICATION_CODE_EXPIRY: 10,
    PASSWORD_RESET_EXPIRY: 10
  },

  // In seconds
  CACHE_TTL: {
    ROUTES: 300, // 5 minutes
    TRIPS: 30, // 30 seconds
    ALERTS: 60 // 1 minute
  },

  // Payment constants
  PAYMENT_METHODS: {
    MPESA: 'mpesa',
    CASH: 'cash',
    WALLET: 'wallet'
  },

  // Fare multipliers
  FARE_MULTIPLIERS: {
    PEAK_HOUR: 1.2,
    WEEKEND: 1.1,
    LATE_NIGHT: 1.3
  },

  // Sacco subscription plans
  SACCO_PLANS: {
    BASIC: {
      name: 'basic',
      price: 5000, // KSh per month
      max_vehicles: 10,
      features: ['basic_tracking', 'driver_app']
    },
    PREMIUM: {
      name: 'premium',
      price: 15000, // KSh per month
      max_vehicles: 50,
      features: ['advanced_tracking', 'analytics', 'priority_support']
    },
    ENTERPRISE: {
      name: 'enterprise',
      price: 50000, // KSh per month
      max_vehicles: 200,
      features: ['custom_features', 'api_access', 'dedicated_support']
    }
  }
};