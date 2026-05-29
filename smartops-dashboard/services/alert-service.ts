import api from "@/service/api";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// =========================
// TYPES (FIXED)
// =========================

export interface Alert {
  id: string;
  title: string;
  message: string;

  severity: "CRITICAL" | "WARNING" | "INFO"; // ✅ FIXED
  status: "ACTIVE" | "RESOLVED" | "ACKNOWLEDGED"; // ✅ FIXED

  serviceName: string;

  createdAt: string; // ✅ FIXED (NOT timestamp)

  resolvedAt?: string;
  acknowledgedAt?: string;
}

export interface AlertStats {
  critical: number;
  warning: number;
  info: number;
  total: number;
  resolved: number;
  active: number;
  acknowledged: number
}

export interface AlertFilter {
  severity?: "CRITICAL" | "WARNING" | "INFO";
  status?: "ACTIVE" | "RESOLVED" | "ACKNOWLEDGED";
  serviceName?: string;
  limit?: number;
}

// =========================
// SERVICE
// =========================

export const alertService = {
  // =========================
  // API METHODS
  // =========================

  async getAlerts(filter?: AlertFilter): Promise<Alert[]> {
    const response = await api.get("/api/alerts", {
      params: filter,
    });
    return response.data;
  },

  async getActiveAlerts(): Promise<Alert[]> {
    const response = await api.get("/api/alerts/active");
    return response.data;
  },

  async getCriticalAlerts(): Promise<Alert[]> {
    const response = await api.get("/api/alerts/critical");
    return response.data;
  },

  async getAlertStats(): Promise<AlertStats> {
    const response = await api.get("/api/alerts/stats");
    return response.data;
  },

  async acknowledgeAlert(alertId: string): Promise<Alert> {
    const response = await api.put(
      `/api/alerts/${alertId}/acknowledge`
    );
    return response.data;
  },

  async resolveAlert(alertId: string): Promise<Alert> {
    const response = await api.put(
      `/api/alerts/${alertId}/resolve`
    );
    return response.data;
  },

  async deleteAlert(alertId: string): Promise<void> {
    await api.delete(`/api/alerts/${alertId}`);
  },

  // =========================
  // WEBSOCKET (FULL FIX)
  // =========================

  subscribeToAlerts(
  onAlert: (alert: Alert) => void,
  onError?: (error: Error) => void,
  onConnect?: () => void,
  onDisconnect?: () => void
): () => void {

  const wsUrl =
    process.env.NEXT_PUBLIC_WS_URL ||
    "http://localhost:8084/ws";

  const client = new Client({
    webSocketFactory: () =>
      new SockJS(wsUrl),

    reconnectDelay: 10000,

    debug: () => {},

    onConnect: () => {

      onConnect?.();

      client.subscribe(
        "/topic/alerts",
        (message) => {
          try {
            const alert: Alert =
              JSON.parse(message.body);

            onAlert(alert);

          } catch {
            // ignore malformed payload
          }
        }
      );

      client.subscribe(
        "/topic/alerts/delete",
        () => {
          // optional delete event
        }
      );
    },

    onWebSocketClose: () => {
      onDisconnect?.();
    },

    onWebSocketError: () => {
      onError?.(
        new Error(
          "WebSocket connection failed"
        )
      );
    },

    onStompError: () => {
      onError?.(
        new Error("STOMP error")
      );
    },
  });

  client.activate();

  return () => {
    if (client.active) {
      client.deactivate();
    }

    onDisconnect?.();
  };
}
};