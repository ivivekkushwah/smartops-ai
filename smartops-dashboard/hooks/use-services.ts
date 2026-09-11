'use client';

import { useEffect, useRef, useState } from 'react';
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
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchServices = async (
    silent = false
  ) => {
    try {
      if (!silent && mountedRef.current) {
        setLoading(true);
      }

      if (mountedRef.current) setError(null);

      const data =
        await serviceHealthService.getServices();

      if (mountedRef.current) setServices(data);

    } catch (err) {

      if (mountedRef.current) {
        setError(
          err instanceof Error
            ? err
            : new Error(
                'Failed to fetch services'
              )
        );

        setServices([]);
      }

    } finally {

      if (!silent && mountedRef.current) {
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
