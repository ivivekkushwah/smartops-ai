'use client';

import { useAuth as useAuthContext } from '@/lib/auth-context';

/**
 * Enhanced useAuth hook with additional utilities
 * Provides access to auth state, methods, and error handling
 */
export function useAuth() {
  const auth = useAuthContext();

  return {
    ...auth,
    /**
     * Check if a specific user is authenticated
     */
    isLoggedIn: (): boolean => !!auth.user,

    /**
     * Get user initials for avatar
     */
    getUserInitials: (): string => {
      if (!auth.user?.name) return 'U';
      return auth.user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    },

    /**
     * Get full user display name
     */
    getDisplayName: (): string => {
      return auth.user?.name || 'User';
    },

    /**
     * Get user email
     */
    getUserEmail: (): string => {
      return auth.user?.email || '';
    },

    /**
     * Check if user has authenticated
     */
    isReady: (): boolean => !auth.loading,
  };
}
