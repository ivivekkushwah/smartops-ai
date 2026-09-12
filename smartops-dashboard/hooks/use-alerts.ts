"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { alertService, Alert, AlertStats } from "@/services/alert-service";

import { useAuth } from "@/lib/auth-context";

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

export function useAlerts(subscribeToUpdates = true): UseAlertsReturn {
  const { user, loading: authLoading } = useAuth();

  const userId = user?.id;

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState<AlertStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  // =========================================
  // FETCH ALERTS
  // =========================================

  const fetchAlerts = useCallback(async () => {
    if (authLoading) {
      return;
    }

    if (!userId) {
      if (mountedRef.current) {
        setAlerts([]);
        setStats(null);
        setLoading(false);
      }
      return;
    }

    try {
      if (mountedRef.current) {
        setLoading(true);
        setError(null);
      }

      const [alertsData, statsData] = await Promise.all([
        alertService.getAlerts(),
        alertService.getAlertStats(),
      ]);

      if (mountedRef.current) {
        setAlerts(alertsData);
        setStats(statsData);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch alerts"),
        );
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [authLoading, userId]);

  // =========================================
  // INITIAL FETCH
  // =========================================

  useEffect(() => {
    if (authLoading) {
      return;
    }

    fetchAlerts();
  }, [authLoading, fetchAlerts]);

  // =========================================
  // WEBSOCKET
  // =========================================

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!userId) {
      setIsConnected(false);
      return;
    }

    if (!subscribeToUpdates) {
      return;
    }

    const cleanup = alertService.subscribeToAlerts(
      userId,

      // =========================
      // NEW ALERT
      // =========================

      (newAlert) => {
        if (!mountedRef.current) return;
        if (newAlert.userId !== userId) return;

        setAlerts((prev) => {
          const exists = prev.some((alert) => alert.id === newAlert.id);

          if (exists) {
            return prev.map((alert) =>
              alert.id === newAlert.id ? newAlert : alert,
            );
          }

          return [newAlert, ...prev];
        });
      },

      // =========================
      // DELETE
      // =========================

      (alertId) => {
        if (!mountedRef.current) return;
        if (!alertId) return;

        setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
      },

      // =========================
      // ERROR
      // =========================
      (error) => {
        if (!mountedRef.current) return;

        setIsConnected(false);
      },

      // =========================
      // CONNECT
      // =========================

      () => {
        if (!mountedRef.current) return;

        setIsConnected(true);
      },

      // =========================
      // DISCONNECT
      // =========================

      () => {
        if (!mountedRef.current) return;

        setIsConnected(false);
      },
    );

    return cleanup;
  }, [authLoading, userId, subscribeToUpdates]);

  // =========================================
  // ACKNOWLEDGE
  // =========================================

  const acknowledge = useCallback(
    async (alertId: string) => {
      if (!userId) {
        return;
      }

      try {
        setError(null);

        await alertService.acknowledgeAlert(alertId);

        await fetchAlerts();
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to acknowledge alert"),
        );
      }
    },
    [userId, fetchAlerts],
  );

  // =========================================
  // RESOLVE
  // =========================================

  const resolve = useCallback(
    async (alertId: string) => {
      if (!userId) {
        return;
      }

      try {
        setError(null);

        await alertService.resolveAlert(alertId);

        await fetchAlerts();
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to resolve alert"),
        );
      }
    },
    [userId, fetchAlerts],
  );

  // =========================================
  // DELETE
  // =========================================

  const deleteAlert = useCallback(
    async (alertId: string) => {
      if (!userId) {
        return;
      }

      try {
        setError(null);

        await alertService.deleteAlert(alertId);

        await fetchAlerts();
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to delete alert"),
        );
      }
    },
    [userId, fetchAlerts],
  );

  // =========================================
  // RETURN
  // =========================================

  return {
    alerts,
    stats,
    loading,
    error,
    refetch: fetchAlerts,
    acknowledge,
    resolve,
    delete: deleteAlert,
    isConnected,
  };
}
