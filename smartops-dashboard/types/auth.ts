/**
 * Authentication types and interfaces
 * Shared types used across the authentication system
 */

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  expiresIn?: number;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface AuthError {
  message: string;
  code?: string;
  status?: number;
  field?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetResponse {
  message: string;
  resetLink?: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: AuthError | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email: string, password: string, name: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

/**
 * HTTP Error response from backend
 */
export interface HttpErrorResponse {
  status: number;
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
  timestamp?: string;
  path?: string;
}

/**
 * Session storage keys
 */
export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
  AUTH_EXPIRES: 'authExpires',
} as const;

/**
 * Auth endpoints
 */
export const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  REFRESH: '/api/auth/refresh',
  ME: '/api/auth/me',
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  RESET_PASSWORD: '/api/auth/reset-password',
  VERIFY_EMAIL: '/api/auth/verify-email',
} as const;
