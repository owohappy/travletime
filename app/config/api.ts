/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */

// Base API URL - Change this to your actual API endpoint
export const API_BASE_URL = 'https://tt.owohappy.com:8080';

// Alternative: Use environment variables (recommended for production)
// export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://tt.owohappy.com:8080';

// API Endpoints Configuration
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    LOGOUT: '/logout',
    REFRESH_TOKEN: '/refresh-token',
    CHECK_TOKEN: '/check-token',
  },

  // Password Reset
  PASSWORD_RESET: {
    INITIATE: '/password-reset/initiate',
    CONFIRM: '/password-reset/confirm',
  },

  // Email Verification
  EMAIL_VERIFICATION: '/verify-email',

  // Two-Factor Authentication
  TWO_FA: {
    ENABLE: '/2fa/enable',
    VERIFY: '/2fa/verify',
  },

  // User Profile & Account Management
  USER: {
    GET_PROFILE: (userId: string) => `/user/${userId}/getData`,
    UPDATE_PROFILE: (userId: string) => `/user/${userId}/updateData`,
    GET_POINTS: (userId: string) => `/user/${userId}/points`,
    CONFIRM_TRAVEL: (userId: string, travelId: string) => `/user/${userId}/confirm_travel/${travelId}`,
  },

  // Travel Tracking
  TRAVEL: {
    GPS_TRACK: (userId: string) => `/gps/track/${userId}`,
    GPS_STATUS: (userId: string) => `/gps/status/${userId}`,
    NEARBY_ROUTES: '/gps/routes/nearby',
    HEARTBEAT: (userId: string) => `/heartbeat/${userId}`, // Legacy
  },

  // Statistics & Metrics
  STATS: {
    USERS_COUNT: '/stats/users_count',
    POINTS_TOTAL: '/stats/points_total',
    LEADERBOARD: '/stats/leaderboard',
  },

  // Analytics
  ANALYTICS: {
    POPULAR_ROUTES: '/analytics/popular-routes',
    OPERATOR_STATS: '/analytics/operator-stats',
    TRANSPORT_PATTERNS: '/analytics/transport-patterns',
    USER_TRAVEL_INSIGHTS: (userId: string) => `/analytics/user/${userId}/travel-insights`,
    DASHBOARD: '/analytics/dashboard',
  },

  // Admin Operations
  ADMIN: {
    ROUTE_CACHE_REFRESH: '/admin/routes/refresh',
    ROUTE_CACHE_STATUS: '/admin/routes/status',
  },

  // Health Check
  HEALTH: '/ping',
} as const;

// API Configuration Settings
export const API_CONFIG = {
  TIMEOUT: 10000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const;

// GPS Tracking Configuration
export const GPS_CONFIG = {
  TRACKING_INTERVAL: 30000, // 30 seconds
  MIN_DISTANCE_FOR_UPDATE: 10, // meters
  MAX_LOCATION_AGE: 60000, // 1 minute
  HIGH_ACCURACY: true,
  TIMEOUT: 15000,
} as const;

// Points and Rewards Configuration
export const REWARDS_CONFIG = {
  POINTS_PER_KM: 10,
  BONUS_MULTIPLIER: 1.5,
  DAILY_BONUS: 50,
  WEEKLY_BONUS: 200,
} as const;
