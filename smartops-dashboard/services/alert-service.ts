import api from "@/service/api"
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface Alert {
  id: string
  title: string
  message: string
  severity: 'critical' | 'warning' | 'info'
  status: 'active' | 'resolved' | 'acknowledged'
  serviceId: string
  source: string
  timestamp: string
  resolvedAt?: string
  acknowledgedAt?: string
  acknowledgedBy?: string
}

export interface AlertStats {
  critical: number
  warning: number
  info: number
  total: number
  resolved: number
  active: number
}

export interface AlertFilter {
  severity?: 'critical' | 'warning' | 'info'
  status?: 'active' | 'resolved' | 'acknowledged'
  serviceId?: string
  limit?: number
}

export const alertService = {
  // Get all alerts
  async getAlerts(filter?: AlertFilter): Promise<Alert[]> {
    try {
      const response = await api.get('/api/alerts', {
        params: filter,
      })

      return response.data
    } catch (error) {
      console.error('Failed to fetch alerts:', error)
      throw error
    }
  },

  // Get active alerts
  async getActiveAlerts(): Promise<Alert[]> {
    try {
      const response = await api.get('/api/alerts/active')

      return response.data
    } catch (error) {
      console.error('Failed to fetch active alerts:', error)
      throw error
    }
  },

  // Get critical alerts
  async getCriticalAlerts(): Promise<Alert[]> {
    try {
      const response = await api.get('/api/alerts/critical')

      return response.data
    } catch (error) {
      console.error('Failed to fetch critical alerts:', error)
      throw error
    }
  },

  // Get alert statistics
  async getAlertStats(): Promise<AlertStats> {
    try {
      const response = await api.get('/api/alerts/stats')

      return response.data
    } catch (error) {
      console.error('Failed to fetch alert stats:', error)
      throw error
    }
  },

  // Acknowledge alert
  async acknowledgeAlert(alertId: string): Promise<Alert> {
    try {
      const response = await api.put(
        `/api/alerts/${alertId}/acknowledge`
      )

      return response.data
    } catch (error) {
      console.error(`Failed to acknowledge alert ${alertId}:`, error)
      throw error
    }
  },

  // Resolve alert
  async resolveAlert(alertId: string): Promise<Alert> {
    try {
      const response = await api.put(
        `/api/alerts/${alertId}/resolve`
      )

      return response.data
    } catch (error) {
      console.error(`Failed to resolve alert ${alertId}:`, error)
      throw error
    }
  },

  // Delete alert
  async deleteAlert(alertId: string): Promise<void> {
    try {
      await api.delete(`/api/alerts/${alertId}`)
    } catch (error) {
      console.error(`Failed to delete alert ${alertId}:`, error)
      throw error
    }
  },

  

subscribeToAlerts(
  onAlert: (alert: Alert) => void,
  onError?: (error: Error) => void
): () => void {
  const wsUrl =
    process.env.NEXT_PUBLIC_WS_URL ||
    'http://localhost:8084/ws'; // ✅ ONLY endpoint

  const client = new Client({
    webSocketFactory: () => new SockJS(wsUrl),
    reconnectDelay: 3000,

    onConnect: () => {
      console.log('[Alerts] Connected');

      // ✅ Subscribe to topic
      client.subscribe('/topic/alerts', (message) => {
        try {
          const alert: Alert = JSON.parse(message.body);
          onAlert(alert);
        } catch (err) {
          console.error('[Alerts] Parse error:', err);
        }
      });
    },

    onStompError: (frame) => {
      console.error('[Alerts] STOMP error:', frame);
      onError?.(new Error('STOMP connection failed'));
    },
  });

  client.activate();

  return () => {
    client.deactivate();
  };
}
}