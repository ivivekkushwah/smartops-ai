import api from '@/service/api';
import { Insight } from '@/hooks/use-insights';

export const insightService = {

  async getInsights(): Promise<Insight[]> {
    const response = await api.get('/api/insights');
    return response.data;
  },

  subscribeToInsights(
    onInsight: (insight: Insight) => void,
    onError?: (error: Error) => void
  ) {
    const interval = setInterval(async () => {
      try {
        const insights = await this.getInsights();

        if (insights.length > 0) {
          onInsight(insights[0]);
        }
      } catch (error) {
        onError?.(
          error instanceof Error
            ? error
            : new Error('Failed to fetch insights')
        );
      }
    }, 10000);

    return () => clearInterval(interval);
  },
};