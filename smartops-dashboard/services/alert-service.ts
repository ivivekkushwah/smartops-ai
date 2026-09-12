import api from "@/service/api";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// =========================
// TYPES
// =========================

export interface Alert {
  id: string;
  title: string;
  message: string;

  severity: "CRITICAL" | "WARNING" | "INFO";
  status: "ACTIVE" | "RESOLVED" | "ACKNOWLEDGED";

  serviceName: string;
  userId: string;

  createdAt: string;

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
  acknowledged: number;
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
  // GET ALL ALERTS
  // =========================

  async getAlerts(
    filter?: AlertFilter
  ): Promise<Alert[]> {

    const response = await api.get("/api/alerts", {
      params: filter,
    });

    return response.data;
  },


  // =========================
  // GET ACTIVE ALERTS
  // =========================

  async getActiveAlerts(): Promise<Alert[]> {

    const response = await api.get(
      "/api/alerts/active",
    );

    return response.data;
  },


  // =========================
  // GET CRITICAL ALERTS
  // =========================

  async getCriticalAlerts(): Promise<Alert[]> {

    const response = await api.get(
      "/api/alerts/critical",
    );

    return response.data;
  },


  // =========================
  // GET ALERT STATS
  // =========================

  async getAlertStats(): Promise<AlertStats> {

    const response = await api.get(
      "/api/alerts/stats",
    );

    return response.data;
  },


  // =========================
  // ACKNOWLEDGE ALERT
  // =========================

  async acknowledgeAlert(alertId: string): Promise<Alert> {

    const response = await api.put(
      `/api/alerts/${alertId}/acknowledge`,
      null
    );

    return response.data;
  },


  // =========================
  // RESOLVE ALERT
  // =========================

  async resolveAlert(alertId: string): Promise<Alert> {

    const response = await api.put(
      `/api/alerts/${alertId}/resolve`,
      null
    );

    return response.data;
  },


  // =========================
  // DELETE ALERT
  // =========================

  async deleteAlert(alertId: string): Promise<void> {

    await api.delete(
      `/api/alerts/${alertId}`
    );
  },


  // =========================
  // WEBSOCKET
  // =========================

  subscribeToAlerts(
  userId: string,
  onAlert: (alert: Alert) => void,
  onDelete?: (alertId: string) => void,
  onError?: (error: Error) => void,
  onConnect?: () => void,
  onDisconnect?: () => void
): () => void {
  return alertSocket.subscribe(userId, onAlert, onDelete, onError, onConnect, onDisconnect);
},
};

type AlertListener = {
  onAlert: (alert: Alert) => void;
  onDelete?: (alertId: string) => void;
  onError?: (error: Error) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
};

class AlertSocket {
  private client: Client | null = null;
  private userId: string | null = null;
  private listeners = new Set<AlertListener>();
  private subscriptions: { unsubscribe: () => void }[] = [];

  subscribe(
    userId: string,
    onAlert: (alert: Alert) => void,
    onDelete?: (alertId: string) => void,
    onError?: (error: Error) => void,
    onConnect?: () => void,
    onDisconnect?: () => void,
  ): () => void {
    const listener = { onAlert, onDelete, onError, onConnect, onDisconnect };
    this.listeners.add(listener);

    if (this.userId !== userId) {
      this.disconnect();
      this.userId = userId;
      this.connect();
    } else if (this.client?.connected) {
      onConnect?.();
    }

    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0) this.disconnect();
    };
  }

  private connect(): void {
    const userId = this.userId;
    if (!userId || this.client?.active) return;

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8080/ws";
    const client = new Client({
    webSocketFactory: () => new SockJS(wsUrl),

    reconnectDelay: 10000,

    debug: () => {},

    onConnect: () => {
      if (this.client !== client || this.userId !== userId) return;
      this.listeners.forEach((listener) => listener.onConnect?.());

      this.subscriptions = [client.subscribe(
        `/topic/alerts/${userId}`,
        (message) => {
          const body = message.body?.trim();
          if (!body) return;

          if (!body || this.client !== client) return;

          try {
            const alert: Alert = JSON.parse(body);

            if (alert.userId !== userId) return;
            this.listeners.forEach((listener) => listener.onAlert(alert));
          } catch {
            // Ignore malformed payloads from the stream.
          }
        }
      ),

      client.subscribe(
        `/topic/alerts/delete/${userId}`,
        (message) => {
          const body = message.body?.trim();

          if (!body || this.client !== client) return;

          try {
            const data = JSON.parse(body);

            if (!data?.id) return;

            this.listeners.forEach((listener) => listener.onDelete?.(data.id));
          } catch {
            // Ignore malformed payloads from the stream.
          }
        }
      )];
    },

    onWebSocketClose: () => {
      if (this.client !== client) return;
      this.listeners.forEach((listener) => listener.onDisconnect?.());
    },

    onWebSocketError: () => {
      if (this.client === client) this.listeners.forEach((listener) => listener.onError?.(new Error("Alert WebSocket connection failed")));
    },

    onStompError: () => {
      if (this.client === client) this.listeners.forEach((listener) => listener.onError?.(new Error("Alert STOMP error")));
    },
  });

    this.client = client;
    client.activate();
  }

  private disconnect(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions = [];
    const client = this.client;
    this.client = null;
    this.userId = null;
    if (client?.active) void client.deactivate();
  }
}

const alertSocket = new AlertSocket();
