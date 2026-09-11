'use client';

import { useEffect, useRef, useState } from 'react';
import { dashboardService, DashboardMetrics } from '@/services/dashboard-service';

export interface UseDashboardReturn {
  metrics: DashboardMetrics | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching dashboard metrics from backend
 * Includes error handling, loading state, and refetch capability
 */
export function useDashboard(refetchInterval?: number): UseDashboardReturn {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchMetrics = async (silent = false) => {
  try {
    if (!silent && mountedRef.current) setLoading(true);
    if (mountedRef.current) setError(null);

    const data = await dashboardService.getMetrics();
    if (mountedRef.current) setMetrics(data);

  } catch (err) {
    if (mountedRef.current) setError(err instanceof Error ? err : new Error('Failed to fetch metrics'));
  } finally {
    if (!silent && mountedRef.current) setLoading(false);
  }
};

  useEffect(() => {
    fetchMetrics();

    // Optional polling for real-time updates
    if (refetchInterval) {
      const interval = setInterval(fetchMetrics, refetchInterval);
      return () => clearInterval(interval);
    }
  }, [refetchInterval]);

  return {
    metrics,
    loading,
    error,
    refetch: fetchMetrics,
  };
}
