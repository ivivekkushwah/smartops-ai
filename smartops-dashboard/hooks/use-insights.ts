'use client';

import { useEffect, useState } from 'react';
import { insightService } from '@/services/insight-service';

export interface Insight {
  id: string;
  serviceName: string;
  severity: string;
  summary: string;
  rootCause: string;
  impact: string;
  recommendation: string;
  confidence: number;
  createdAt: string;
}

export function useInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadInsights();

    const unsubscribe = insightService.subscribeToInsights(
      (insight: Insight) => {
        setInsights(prev => {
          const exists = prev.some(i => i.id === insight.id);

          if (exists) {
            return prev.map(i =>
              i.id === insight.id ? insight : i
            );
          }

          return [insight, ...prev];
        });
      },
      (err) => setError(err)
    );

    return unsubscribe;
  }, []);

  const loadInsights = async () => {
    try {
      setLoading(true);

      const data = await insightService.getInsights();

      setInsights(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to load insights')
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    insights,
    loading,
    error,
    refresh: loadInsights,
  };
}