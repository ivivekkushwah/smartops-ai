'use client';

import { useEffect, useState } from 'react';
import {
  serviceHealthService,
  ServiceStatus,
} from '@/services/service-health';

export interface UseServicesReturn {
  services: ServiceStatus[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useServices(
  pollInterval?: number
): UseServicesReturn {
  const [services, setServices] =
    useState<ServiceStatus[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<Error | null>(null);

  const fetchServices = async (
    silent = false
  ) => {
    try {
      if (!silent) {
        setLoading(true);
      }

      setError(null);

      const data =
        await serviceHealthService.getServices();

      setServices(data);

    } catch (err) {

      setError(
        err instanceof Error
          ? err
          : new Error(
              'Failed to fetch services'
            )
      );

      setServices([]);

    } finally {

      if (!silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {

    fetchServices();

    if (!pollInterval) return;

    const interval = setInterval(() => {
      fetchServices(true);
    }, pollInterval);

    return () => clearInterval(interval);

  }, [pollInterval]);

  return {
    services,
    loading,
    error,
    refetch: () => fetchServices(),
  };
}