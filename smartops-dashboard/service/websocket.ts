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

  async connect(onMessage: (log: Log) => void) {
    // IMPORTANT: only /ws (not /topic/logs)
    const socket = new SockJS('http://localhost:8080/ws')
    const { Client } = await import('@stomp/stompjs')

    this.client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,

      onConnect: () => {
        console.log('✅ WebSocket connected')

        // Subscribe to logs topic
        this.client?.subscribe(
          '/topic/logs',
          (message: IMessage) => {
            try {
              const data: Log = JSON.parse(message.body)
              onMessage(data)
            } catch (err) {
              console.error('❌ Parse error:', err)
            }
          }
        )
      },

      onStompError: (frame) => {
        console.error('❌ STOMP error:', frame)
      },

      onWebSocketError: (error) => {
        console.error('❌ WebSocket error:', error)
      },

      onDisconnect: () => {
        console.log('🔌 WebSocket disconnected')
      },
    })

    this.client.activate()
  }

  // =========================
  // DISCONNECT
  // =========================

  disconnect() {
    if (this.client) {
      this.client.deactivate()
      this.client = null
      console.log('🔌 Disconnected manually')
    }
  }
}

// =========================
// EXPORT SINGLETON
// =========================

export const websocketService = new WebSocketService()