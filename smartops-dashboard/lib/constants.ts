/**
 * Application Constants and Configuration
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8082/ws',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Polling Intervals
export const POLLING_INTERVALS = {
  DASHBOARD: parseInt(process.env.NEXT_PUBLIC_DASHBOARD_POLL_INTERVAL || '5000'),
  SERVICES: parseInt(process.env.NEXT_PUBLIC_SERVICE_POLL_INTERVAL || '30000'),
  LOGS: parseInt(process.env.NEXT_PUBLIC_LOG_POLL_INTERVAL || '10000'),
  METRICS: 5000,
};

// Feature Flags
export const FEATURES = {
  ENABLE_WEBSOCKET: process.env.NEXT_PUBLIC_ENABLE_WEBSOCKET === 'true',
  DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
};

// API Endpoints
export const ENDPOINTS = {
  // Authentication
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  REFRESH: '/api/auth/refresh',
  ME: '/api/auth/me',
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  RESET_PASSWORD: '/api/auth/reset-password',

  // Dashboard & Monitoring
  METRICS: '/api/monitoring/metrics',
  HEALTH: '/api/monitoring/health',
  REALTIME: '/api/monitoring/realtime',
  KAFKA_METRICS: '/api/monitoring/kafka',

  // Services
  SERVICES: '/api/services',
  SERVICE_HEALTH: '/api/services/health',
  SERVICE_METRICS: '/api/services/:id/metrics',
  SERVICE_LOGS: '/api/services/:id/logs',
  SERVICE_UPTIME: '/api/services/:id/uptime',
  SERVICES_STATUS: '/api/services/status/summary',

  // Logs
  LOGS: '/api/logs',
  LOGS_RECENT: '/api/logs/recent',
  LOGS_SERVICE: '/api/logs/service/:id',
  LOGS_LEVEL: '/api/logs/level',
  LOGS_SEARCH: '/api/logs/search',
  LOGS_STATS: '/api/logs/stats',

  // Alerts
  ALERTS: '/api/alerts',
  ALERTS_ACTIVE: '/api/alerts/active',
  ALERTS_CRITICAL: '/api/alerts/critical',
  ALERTS_STATS: '/api/alerts/stats',
  ALERT_ACKNOWLEDGE: '/api/alerts/:id/acknowledge',
  ALERT_RESOLVE: '/api/alerts/:id/resolve',
  ALERT_DELETE: '/api/alerts/:id',
};

// WebSocket Topics
export const WS_TOPICS = {
  LOGS: '/topic/logs',
  ALERTS: '/topic/alerts',
  SERVICES: '/topic/services',
  METRICS: '/topic/metrics',
};

// Service Names
export const SERVICES = {
  AUTH: 'AUTH-SERVICE',
  GATEWAY: 'API-GATEWAY',
  MONITORING: 'MONITORING-SERVICE',
  ALERT: 'ALERT-SERVICE',
  EUREKA: 'EUREKA-SERVER',
  LOG: 'LOG-SERVICE',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  TIMEOUT: 'Request timeout. Please try again.',
  UNAUTHORIZED: 'Your session has expired. Please log in again.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

// Status Colors/Badges
export const STATUS_COLORS = {
  online: 'bg-green/15 text-green2 border-green/30',
  offline: 'bg-red/15 text-red2 border-red/30',
  degraded: 'bg-amber/15 text-amber2 border-amber/30',
  warning: 'bg-amber/15 text-amber2 border-amber/30',
  critical: 'bg-red/15 text-red2 border-red/30',
  info: 'bg-blue/15 text-blue2 border-blue/30',
};

// Alert Severity Levels
export const ALERT_SEVERITY = {
  CRITICAL: 'critical',
  WARNING: 'warning',
  INFO: 'info',
};

// Log Levels
export const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
};
