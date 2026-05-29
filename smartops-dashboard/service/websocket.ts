'use client'

import SockJS from 'sockjs-client'
import type { Client, IMessage } from '@stomp/stompjs'

// =========================
// TYPES
// =========================

export interface Log {
  id: string
  timestamp: string
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'
  serviceName: string
  message: string
}

// =========================
// WEBSOCKET SERVICE
// =========================

class WebSocketService {
  private client: Client | null = null

  // =========================
  // CONNECT
  // =========================

  async connect(
  onMessage: (log: Log) => void
) {
  if (this.client?.active) {
    return;
  }

  const { Client } =
    await import('@stomp/stompjs');

  this.client = new Client({
    webSocketFactory: () =>
      new SockJS(
        'http://localhost:8080/ws'
      ),

    reconnectDelay: 10000,

    debug: () => {},

    onConnect: () => {
      this.client?.subscribe(
        '/topic/logs',
        (message: IMessage) => {
          try {
            const data: Log =
              JSON.parse(message.body);

            onMessage(data);

          } catch {
            // ignore bad messages
          }
        }
      );
    },

    onStompError: () => {},

    onWebSocketError: () => {},

    onDisconnect: () => {},
  });

  this.client.activate();
}

disconnect() {
  if (!this.client) return;

  if (this.client.active) {
    this.client.deactivate();
  }

  this.client = null;
}
}

// =========================
// EXPORT SINGLETON
// =========================

export const websocketService = new WebSocketService()