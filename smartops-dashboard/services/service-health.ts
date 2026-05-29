import api from '@/service/api'

export interface ServiceStatus {
  id: string
  serviceName: string
  status: 'UP' | 'DOWN'
  responseTime: number
  lastChecked: string
}

export interface ServiceMetrics {
  timestamp: string
  value: number
  label: string
}

export interface ServiceLog {
  timestamp: string
  level: 'INFO' | 'WARN' | 'ERROR'
  message: string
  serviceName: string
}

export const serviceHealthService = {
  // =========================
  // GET ALL SERVICES
  // =========================
  async getServices(): Promise<ServiceStatus[]> {
    const response = await api.get(
      '/api/monitor/services'
    )
    return response.data
  },

  // =========================
  // GET SERVICE HEALTH
  // =========================
  async getServiceHealth(
    serviceName: string
  ): Promise<ServiceStatus> {
    const response = await api.get(
      `/api/monitor/services/${serviceName}`
    )
    return response.data
  },

  // =========================
  // GET SERVICE METRICS
  // =========================
  async getServiceMetrics(
    serviceName: string,
    timeRange: 'hour' | 'day' | 'week' = 'hour'
  ): Promise<ServiceMetrics[]> {
    const response = await api.get(
      `/api/monitor/services/${serviceName}/metrics`,
      {
        params: { timeRange },
      }
    )
    return response.data
  },

  // =========================
  // GET SERVICE LOGS
  // =========================
  async getServiceLogs(
    serviceName: string,
    limit = 100
  ): Promise<ServiceLog[]> {
    const response = await api.get(
      `/api/monitor/services/${serviceName}/logs`,
      {
        params: { limit },
      }
    )
    return response.data
  },

  // =========================
  // GET SERVICE UPTIME
  // =========================
  async getServiceUptime(
    serviceName: string
  ): Promise<{
    uptime: number
    lastDowntime?: string
  }> {
    const response = await api.get(
      `/api/monitor/services/${serviceName}/uptime`
    )
    return response.data
  },

  // =========================
  // SERVICE SUMMARY
  // =========================
  async checkAllServices(): Promise<{
    healthy: number
    unhealthy: number
    total: number
  }> {
    const response = await api.get(
      '/api/monitor/services/status/summary'
    )
    return response.data
  },

  // =========================
// DELETE SERVICE
// =========================
async deleteService(
  id: string
): Promise<void> {

  await api.delete(
    `/api/monitor/services/${id}`
  )
},
}