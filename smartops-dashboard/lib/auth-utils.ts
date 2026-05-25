/**
 * Authentication utilities for common operations
 */

import { AUTH_STORAGE_KEYS } from '@/types/auth';

/**
 * Token management utilities
 */
export const tokenUtils = {
  /**
   * Store tokens in localStorage
   */
  setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

      // Set expiration time (assuming 1 hour expiry)
      const expiresAt = Date.now() + 60 * 60 * 1000;
      localStorage.setItem(AUTH_STORAGE_KEYS.AUTH_EXPIRES, expiresAt.toString());
    }
  },

  /**
   * Retrieve access token
   */
  getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    }
    return null;
  },

  /**
   * Retrieve refresh token
   */
  getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
    }
    return null;
  },

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    if (typeof window !== 'undefined') {
      const expiresAt = localStorage.getItem(AUTH_STORAGE_KEYS.AUTH_EXPIRES);
      if (!expiresAt) return true;
      return Date.now() > parseInt(expiresAt);
    }
    return true;
  },

  /**
   * Clear all tokens
   */
  clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(AUTH_STORAGE_KEYS.AUTH_EXPIRES);
      localStorage.removeItem(AUTH_STORAGE_KEYS.USER_DATA);
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isTokenExpired();
  },
};

/**
 * Form validation utilities
 */
export const validationUtils = {
  /**
   * Validate email format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate password strength
   */
  isValidPassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('Password must contain at least one special character (!@#$%^&*)');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate name
   */
  isValidName(name: string): boolean {
    return name.trim().length >= 2 && name.trim().length <= 100;
  },

  /**
   * Get password strength level
   */
  getPasswordStrength(password: string): 'weak' | 'fair' | 'good' | 'strong' {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;

    if (strength <= 1) return 'weak';
    if (strength <= 2) return 'fair';
    if (strength <= 3) return 'good';
    return 'strong';
  },
};

/**
 * Error handling utilities
 */
export const errorUtils = {
  /**
   * Extract error message from various error types
   */
  getErrorMessage(error: any): string {
    // Axios error with response
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }

    // Standard error message
    if (error?.message) {
      return error.message;
    }

    // Fallback
    return 'An unexpected error occurred. Please try again.';
  },

  /**
   * Check if error is network-related
   */
  isNetworkError(error: any): boolean {
    return (
      !error?.response ||
      error?.message === 'Network Error' ||
      error?.code === 'ECONNABORTED'
    );
  },

  /**
   * Check if error is authentication-related
   */
  isAuthError(error: any): boolean {
    return error?.response?.status === 401 || error?.response?.status === 403;
  },

  /**
   * Check if error is validation-related
   */
  isValidationError(error: any): boolean {
    return error?.response?.status === 400;
  },

  /**
   * Get field-specific error messages
   */
  getFieldErrors(error: any): Record<string, string> {
    if (error?.response?.data?.errors) {
      const errors = error.response.data.errors;
      if (typeof errors === 'object') {
        // Flatten array errors to single string
        return Object.entries(errors).reduce((acc, [key, value]) => {
          const messages = Array.isArray(value) ? value : [value];
          acc[key] = (messages[0] as string) || 'Invalid input';
          return acc;
        }, {} as Record<string, string>);
      }
    }
    return {};
  },
};

/**
 * Session management utilities
 */
export const sessionUtils = {
  /**
   * Track last activity timestamp
   */
  updateActivityTime(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('lastActivity', Date.now().toString());
    }
  },

  /**
   * Check if session is idle (e.g., for logout after inactivity)
   */
  isSessionIdle(timeoutMinutes: number = 30): boolean {
    if (typeof window !== 'undefined') {
      const lastActivity = sessionStorage.getItem('lastActivity');
      if (!lastActivity) return false;

      const elapsedMs = Date.now() - parseInt(lastActivity);
      const timeoutMs = timeoutMinutes * 60 * 1000;

      return elapsedMs > timeoutMs;
    }
    return false;
  },

  /**
   * Clear session data
   */
  clearSession(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.clear();
    }
  },
};
