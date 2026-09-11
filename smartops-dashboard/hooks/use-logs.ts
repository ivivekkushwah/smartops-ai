'use client';

import { useEffect, useRef, useState } from 'react';

import { logService } from '@/services/log-service';
import { useAuth } from '@/lib/auth-context';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  serviceName: string;
  metadata?: Record<string, any>;
}

export function useLogs() {
  const { user, loading: authLoading } = useAuth();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConnected, setIsConnected] =
    useState(false);

  const unsubscribeRef =
    useRef<(() => void) | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.id) {
      setLogs([]);
      setIsConnected(false);
      return;
    }
    fetchLogs();

    connectWebSocket(user.id);

    return () => {
      unsubscribeRef.current?.();
    };
  }, [authLoading, user?.id]);

  // =========================
  // FETCH INITIAL LOGS
  // =========================

  const fetchLogs = async () => {
    try {
      const data =
        await logService.getRecentLogs(50);

      setLogs(
        data.map((log) => ({
          ...log,
          serviceName:
            (log as Partial<LogEntry>)
              .serviceName ?? 'unknown',
        }))
      );

      setIsConnected(true);
    } catch (error) {
      console.error(
        'Failed to fetch logs:',
        error
      );

      setIsConnected(false);
    }
  };

  // =========================
  // WEBSOCKET CONNECTION
  // =========================

  const connectWebSocket = (userId: string) => {
    const unsubscribe =
      logService.subscribeToLogs(
        userId,
        (newLog) => {
          setLogs((prev) =>
            [
              {
                ...newLog,
                serviceName:
                  (newLog as Partial<LogEntry>)
                    .serviceName ??
                  'unknown',
              } as LogEntry,
              ...prev,
            ].slice(0, 50)
          );

          setIsConnected(true);
        },

        (error) => {
          console.error(
            'WebSocket connection failed:',
            error
          );

          setIsConnected(false);
        }
      );

    unsubscribeRef.current = unsubscribe;
  };

  return {
    logs,
    isConnected,
  };
}
