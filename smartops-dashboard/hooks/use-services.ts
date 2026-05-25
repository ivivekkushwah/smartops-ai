'use client';

import { useEffect, useState } from 'react';
import { serviceHealthService, ServiceStatus } from '@/services/service-health';

export interface UseServicesReturn {
  services: ServiceStatus[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching service health status from backend
 * Includes polling for real-time updates
 */
export function useServices(pollInterval = 30000): UseServicesReturn {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await serviceHealthService.getServices();
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch services'));
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();

    // Poll for service status updates
    const interval = setInterval(fetchServices, pollInterval);
    return () => clearInterval(interval);
  }, [pollInterval]);

  return {
    services,
    loading,
    error,
    refetch: fetchServices,
  };
}
