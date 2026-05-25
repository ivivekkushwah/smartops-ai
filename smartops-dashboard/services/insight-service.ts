import api  from '@/service/api';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Insight } from '@/hooks/use-insights';

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8084/ws';

export const insightService = {
  // ✅ Use axios instance
  async getInsights(): Promise<Insight[]> {
    const res = await api.get('/api/insights');
    return res.data;
  },

  // ✅ STOMP WebSocket
  subscribeToInsights(
    onInsight: (insight: Insight) => void,
    onError?: (error: Error) => void
  ): () => void {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 3000,

      onConnect: () => {
        console.log('[Insights] Connected');

        client.subscribe('/topic/insights', (message) => {
          try {
            const insight: Insight = JSON.parse(message.body);
            onInsight(insight);
          } catch (err) {
            console.error('[Insights] Parse error:', err);
          }
        });
      },

      onStompError: (frame) => {
        console.error('[Insights] STOMP error:', frame);
        onError?.(new Error('WebSocket failed'));
      },
    });

    client.activate();

    return () => client.deactivate();
  },
};