'use client';

import { useEffect, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import {
  alertService,
  Alert,
  AlertStats,
} from '@/services/alert-service';

export interface UseAlertsReturn {
  alerts: Alert[];
  stats: AlertStats | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  acknowledge: (alertId: string) => Promise<void>;
  resolve: (alertId: string) => Promise<void>;
  delete: (alertId: string) => Promise<void>;
  isConnected: boolean;
}

export function useAlerts(
  subscribeToUpdates = true
): UseAlertsReturn {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState<AlertStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const wsUrl =
    process.env.NEXT_PUBLIC_WS_URL ||
    'http://localhost:8084/ws';

  // =========================================
  // FETCH ALERTS + STATS
  // =========================================

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [alertsData, statsData] = await Promise.all([
        alertService.getAlerts(),
        alertService.getAlertStats(),
      ]);

      setAlerts(alertsData);
      setStats(statsData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to fetch alerts')
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================
  // ACTIONS
  // =========================================

  const handleAcknowledge = useCallback(
    async (alertId: string) => {
      try {
        setError(null);
        await alertService.acknowledgeAlert(alertId);
        await fetchAlerts();
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to acknowledge alert')
        );
      }
    },
    [fetchAlerts]
  );

  const handleResolve = useCallback(
    async (alertId: string) => {
      try {
        setError(null);
        await alertService.resolveAlert(alertId);
        await fetchAlerts();
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to resolve alert')
        );
      }
    },
    [fetchAlerts]
  );

  const handleDelete = useCallback(
    async (alertId: string) => {
      try {
        setError(null);
        await alertService.deleteAlert(alertId);
        await fetchAlerts();
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to delete alert')
        );
      }
    },
    [fetchAlerts]
  );

  // =========================================
  // INITIAL LOAD
  // =========================================

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // =========================================
  // WEBSOCKET (FIXED VERSION)
  // =========================================

  useEffect(() => {
    if (!subscribeToUpdates) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 3000,

      debug: (str) => console.log('[STOMP]', str),

      onConnect: () => {
        console.log('✅ Alerts Connected');
        setIsConnected(true);

        client.subscribe('/topic/alerts', (message) => {
          try {
            const newAlert: Alert = JSON.parse(message.body);

            console.log('📩 New Alert:', newAlert);

            setAlerts((prev) => {
              const exists = prev.some(
                (a) => a.id === newAlert.id
              );

              if (exists) {
                return prev.map((a) =>
                  a.id === newAlert.id ? newAlert : a
                );
              }

              return [newAlert, ...prev];
            });
          } catch (err) {
            console.error('Parse error:', err);
          }
        });

        // OPTIONAL: delete event
        client.subscribe('/topic/alerts/delete', (msg) => {
          const { id } = JSON.parse(msg.body);
          setAlerts((prev) =>
            prev.filter((a) => a.id !== id)
          );
        });
      },

      onWebSocketClose: () => {
        console.log('❌ Alerts Disconnected');
        setIsConnected(false);
      },

      onWebSocketError: (err) => {
        console.error('❌ WebSocket Error', err);
        setIsConnected(false);
      },

      onStompError: (frame) => {
        console.error('❌ STOMP Error', frame);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
      setIsConnected(false);
    };
  }, [subscribeToUpdates, wsUrl]);

  // =========================================
  // RETURN
  // =========================================

  return {
    alerts,
    stats,
    loading,
    error,
    refetch: fetchAlerts,
    acknowledge: handleAcknowledge,
    resolve: handleResolve,
    delete: handleDelete,
    isConnected,
  };
}