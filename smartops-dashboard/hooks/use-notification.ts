'use client';

import { useCallback, useState } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

/**
 * Hook for managing toast notifications
 * Provides methods to show/hide notifications with auto-dismiss
 */
export function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback((
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    duration = 4000
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const notification: Notification = { id, type, message, duration };

    setNotifications(prev => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const success = useCallback((message: string, duration?: number) => {
    return notify(message, 'success', duration);
  }, [notify]);

  const error = useCallback((message: string, duration?: number) => {
    return notify(message, 'error', duration ?? 5000);
  }, [notify]);

  const warning = useCallback((message: string, duration?: number) => {
    return notify(message, 'warning', duration);
  }, [notify]);

  const info = useCallback((message: string, duration?: number) => {
    return notify(message, 'info', duration);
  }, [notify]);

  const dismiss = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    notify,
    success,
    error,
    warning,
    info,
    dismiss,
    dismissAll,
  };
}
