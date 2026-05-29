import api from '@/service/api'
import SockJS from 'sockjs-client'
import { Client, IMessage } from '@stomp/stompjs'

export interface Log {
  id: string
  timestamp: string
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'
  serviceId: string
  message: string
  source: string
  metadata?: Record<string, any>
  traceId?: string
}

export interface LogFilter {
  level?: string
  serviceId?: string
  search?: string
  startTime?: string
  endTime?: string
  limit?: number
  offset?: number
}

export interface LogStats {
  totalLogs: number
  logsPerMinute: number
  errorCount: number
  warningCount: number
  infoCount: number
}


export const logService = {
  // Get logs
  async getLogs(filter?: LogFilter): Promise<Log[]> {
    try {
      const response = await api.get('/api/logs', {
        params: filter,
      })

      return response.data
    } catch (error) {
      console.error('Failed to fetch logs:', error)
      throw error
    }
  },

  // Get recent logs
  async getRecentLogs(limit = 100): Promise<Log[]> {
    try {
      const response = await api.get(
        '/api/logs/recent',
        {
          params: { limit },
        }
      )

      return response.data
    } catch (error) {
      console.error(
        'Failed to fetch recent logs:',
        error
      )
      throw error
    }
  },

  // Get service logs
  async getServiceLogs(
    serviceId: string,
    limit = 50
  ): Promise<Log[]> {
    try {
      const response = await api.get(
        `/api/logs/service/${serviceId}`,
        {
          params: { limit },
        }
      )

      return response.data
    } catch (error) {
      console.error(
        `Failed to fetch logs for ${serviceId}:`,
        error
      )
      throw error
    }
  },

  // Get logs by level
  async getLogsByLevel(
    level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'
  ): Promise<Log[]> {
    try {
      const response = await api.get(
        '/api/logs/level',
        {
          params: { level },
        }
      )

      return response.data
    } catch (error) {
      console.error(
        `Failed to fetch ${level} logs:`,
        error
      )
      throw error
    }
  },

  // Search logs
  async searchLogs(
    query: string,
    limit = 50
  ): Promise<Log[]> {
    try {
      const response = await api.get(
        '/api/logs/search',
        {
          params: { query, limit },
        }
      )

      return response.data
    } catch (error) {
      console.error('Failed to search logs:', error)
      throw error
    }
  },

  // Get log stats
  async getLogStats(): Promise<LogStats> {
    try {
      const response = await api.get(
        '/api/logs/stats'
      )

      return response.data
    } catch (error) {
      console.error(
        'Failed to fetch log statistics:',
        error
      )
      throw error
    }
  },



// WebSocket log stream (FIXED)
subscribeToLogs(
  onMessage: (log: Log) => void,
  onError?: (error: Error) => void
): () => void {

  const WS_URL =
    process.env.NEXT_PUBLIC_WS_URL ||
    'http://localhost:8082/ws';

  const client = new Client({
    webSocketFactory: () =>
      new SockJS(WS_URL),

    reconnectDelay: 10000,

    debug: () => {},

    onConnect: () => {

      const subscription =
        client.subscribe(
          '/topic/logs',
          (msg: IMessage) => {
            try {
              const log: Log =
                JSON.parse(msg.body);

              onMessage(log);

            } catch {
              // ignore malformed payloads
            }
          }
        );

      return () => {
        subscription.unsubscribe();
      };
    },

    onWebSocketClose: () => {
      onError?.(
        new Error(
          'WebSocket connection closed'
        )
      );
    },

    onWebSocketError: () => {
      onError?.(
        new Error(
          'WebSocket connection failed'
        )
      );
    },

    onStompError: () => {
      onError?.(
        new Error('STOMP error')
      );
    },
  });

  client.activate();

  return () => {
    if (client.active) {
      client.deactivate();
    }
  };
}
}