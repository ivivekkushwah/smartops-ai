'use client';

import {
  useEffect,
  useState,
  useCallback,
} from 'react';

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

  acknowledge: (
    alertId: string
  ) => Promise<void>;

  resolve: (
    alertId: string
  ) => Promise<void>;

  delete: (
    alertId: string
  ) => Promise<void>;

  isConnected: boolean;
}

/**
 * SmartOps AI Alerts Hook
 * Handles:
 * - Fetching alerts
 * - Stats
 * - Realtime updates
 * - Resolve/Acknowledge/Delete
 */

export function useAlerts(
  subscribeToUpdates = true
): UseAlertsReturn {
  const [alerts, setAlerts] = useState<
    Alert[]
  >([]);

  const [stats, setStats] =
    useState<AlertStats | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<Error | null>(null);

  const [isConnected, setIsConnected] =
    useState(false);

  // =========================================
  // FETCH ALERTS + STATS
  // =========================================

  const fetchAlerts = useCallback(
    async () => {
      try {
        setLoading(true);

        setError(null);

        const [
          alertsData,
          statsData,
        ] = await Promise.all([
          alertService.getAlerts(),

          alertService.getAlertStats(),
        ]);

        setAlerts(alertsData);

        setStats(statsData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error(
                'Failed to fetch alerts'
              )
        );
      } finally {
        setLoading(false);
      }
    },

    []
  );

  // =========================================
  // ACKNOWLEDGE ALERT
  // =========================================

  const handleAcknowledge =
    useCallback(
      async (alertId: string) => {
        try {
          setError(null);

          await alertService.acknowledgeAlert(
            alertId
          );

          await fetchAlerts();
        } catch (err) {
          setError(
            err instanceof Error
              ? err
              : new Error(
                  'Failed to acknowledge alert'
                )
          );
        }
      },

      [fetchAlerts]
    );

  // =========================================
  // RESOLVE ALERT
  // =========================================

  const handleResolve = useCallback(
    async (alertId: string) => {
      try {
        setError(null);

        await alertService.resolveAlert(
          alertId
        );

        await fetchAlerts();
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error(
                'Failed to resolve alert'
              )
        );
      }
    },

    [fetchAlerts]
  );

  // =========================================
  // DELETE ALERT
  // =========================================

  const handleDelete = useCallback(
    async (alertId: string) => {
      try {
        setError(null);

        await alertService.deleteAlert(
          alertId
        );

        await fetchAlerts();
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error(
                'Failed to delete alert'
              )
        );
      }
    },

    [fetchAlerts]
  );

  // =========================================
  // INITIAL LOAD + WEBSOCKET
  // =========================================

  useEffect(() => {
    fetchAlerts();

    // Realtime subscription

    if (subscribeToUpdates) {
      const unsubscribe =
        alertService.subscribeToAlerts(
          (newAlert) => {
            setAlerts((prev) => {
              const exists =
                prev.some(
                  (a) =>
                    a.id === newAlert.id
                );

              if (exists) {
                return prev.map((a) =>
                  a.id === newAlert.id
                    ? newAlert
                    : a
                );
              }

              return [
                newAlert,
                ...prev,
              ];
            });

            setIsConnected(true);
          },

          (err) => {
            console.error(
              'Alert subscription error:',
              err
            );

            setError(err);

            setIsConnected(false);
          }
        );

      return () => {
        unsubscribe();

        setIsConnected(false);
      };
    }
  }, [
    subscribeToUpdates,
    fetchAlerts,
  ]);

  // =========================================
  // RETURN
  // =========================================

  return {
    alerts,

    stats,

    loading,

    error,

    refetch: fetchAlerts,

    acknowledge:
      handleAcknowledge,

    resolve: handleResolve,

    delete: handleDelete,

    isConnected,
  };
}