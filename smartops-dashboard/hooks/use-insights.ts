import { useEffect, useState } from 'react';
import { insightService } from '@/services/insight-service';

export interface Insight {
  id: string;
  type: string;
  message: string;
  severity: string;
  timestamp: string;
}

export function useInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // ✅ initial API load
    insightService
      .getInsights()
      .then(setInsights)
      .catch((err) =>
        setError(err instanceof Error ? err : new Error('Failed'))
      )
      .finally(() => setLoading(false));

    // ✅ real-time updates
    const unsubscribe = insightService.subscribeToInsights(
      (insight) => {
        setInsights((prev) => {
  const exists = prev.some((i) => i.id === insight.id);
  if (exists) return prev; 

  return [insight, ...prev];
});
      },
      (err) => setError(err)
    );

    return unsubscribe;
  }, []);

  return { insights, loading, error };
}