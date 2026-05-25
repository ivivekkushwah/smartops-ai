'use client';

import { useEffect, useState } from 'react';
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

  const fetchMetrics = async (silent = false) => {
  try {
    if (!silent) setLoading(true);
    setError(null);

    const data = await dashboardService.getMetrics();
    setMetrics(data);

  } catch (err) {
    setError(err instanceof Error ? err : new Error('Failed to fetch metrics'));
  } finally {
    if (!silent) setLoading(false);
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
