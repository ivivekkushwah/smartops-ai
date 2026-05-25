import api from "@/service/api"

export interface DashboardMetrics {
  totalLogs: number
  activeServices: number
  cpuMetric: number
  memoryMetric: number
  errorRate: number
  requestThroughput: number
  kafkaMetrics: KafkaMetrics
  serviceUptime: number
}

export interface KafkaMetrics {
  topicsCount: number
  producerCount: number
  consumerCount: number
  throughputMbps: number
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical'
  timestamp: string
  uptime: number
  version: string
}

export interface PerformanceMetric {
  timestamp: string
  value: number
  label: string
}

export const dashboardService = {

  // ✅ FIXED: use /dashboard instead of /metrics
  async getMetrics(): Promise<DashboardMetrics> {
    const response = await api.get('/api/monitor/dashboard')
    return response.data
  },

  // ✅ ALREADY CORRECT
  async getSystemHealth(): Promise<SystemHealth> {
    const response = await api.get('/api/monitor/health')
    return response.data
  },

  // ⚠️ BACKEND DOES NOT HAVE THIS ROUTE
  // You must either REMOVE or IMPLEMENT backend
  async getPerformanceMetrics(
    metric: 'cpu' | 'memory' | 'requests' | 'errors',
    timeRange: 'hour' | 'day' | 'week' = 'day'
  ): Promise<PerformanceMetric[]> {

    // ❌ REMOVE THIS IF NOT IMPLEMENTED IN BACKEND
    const response = await api.get(
      `/api/monitor/services/${metric}/metrics`,
      {
        params: { timeRange },
      }
    )

    return response.data
  },

  // ✅ CORRECT
  async getRealTimeMetrics() {
    const response = await api.get('/api/monitor/realtime')
    return response.data
  },

  // ✅ CORRECT
  async getKafkaMetrics(): Promise<KafkaMetrics> {
    const response = await api.get('/api/monitor/kafka')
    return response.data
  },

  // ❌ WRONG (no such route)
  // 👉 REMOVE or FIX
  async getWeeklyMetrics() {
    const res = await api.get(
      '/api/monitor/services/requests/metrics', // ❌ WRONG STRUCTURE
      {
        params: { timeRange: 'week' },
      }
    )
    return res.data
  },

  // ✅ CORRECT
  async getServiceStats() {
    const res = await api.get('/api/monitor/services')
    return res.data
  },
}