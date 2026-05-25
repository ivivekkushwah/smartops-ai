// ─── Log Types ───────────────────────────────────────────────────────────────

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'TRACE'

export interface LogEntry {
  id: string
  timestamp: string
  level: LogLevel
  service: string
  message: string
  traceId?: string
  spanId?: string
  metadata?: Record<string, unknown>
}

// ─── Service Types ────────────────────────────────────────────────────────────

export type ServiceStatus = 'online' | 'offline' | 'degraded' | 'starting'

export interface ServiceMetrics {
  cpu: number
  memory: number
  responseTime: number
  requestsPerSecond: number
  errorRate: number
  uptime: string
}

export interface Service {
  id: string
  name: string
  status: ServiceStatus
  version: string
  port: number
  host: string
  metrics: ServiceMetrics
  lastChecked: string
  description: string
}

// ─── Alert Types ──────────────────────────────────────────────────────────────

export type AlertSeverity = 'critical' | 'warning' | 'info' | 'resolved'

export interface Alert {
  id: string
  title: string
  description: string
  severity: AlertSeverity
  service: string
  timestamp: string
  acknowledged: boolean
  resolvedAt?: string
  metadata?: Record<string, unknown>
}

// ─── Metric Types ─────────────────────────────────────────────────────────────

export interface OverviewMetric {
  id: string
  label: string
  value: number | string
  unit?: string
  trend: number
  trendDirection: 'up' | 'down' | 'stable'
  color: string
  icon: string
  sparkData: number[]
}

export interface TimeSeriesPoint {
  timestamp: string
  value: number
  label?: string
}

export interface ChartDataPoint {
  time: string
  logs?: number
  errors?: number
  warnings?: number
  kafka?: number
  [key: string]: string | number | undefined
}

export interface PieDataPoint {
  name: string
  value: number
  color: string
}

// ─── AI Insight Types ─────────────────────────────────────────────────────────

export type InsightType =
  | 'anomaly'
  | 'suspicious'
  | 'prediction'
  | 'spike'
  | 'recommendation'

export type InsightSeverity = 'critical' | 'warning' | 'info'

export interface AIInsight {
  id: string
  type: InsightType
  title: string
  description: string
  severity: InsightSeverity
  confidence: number
  affectedService: string
  timestamp: string
  recommendation?: string
  metrics?: Record<string, number | string>
}

// ─── WebSocket Types ──────────────────────────────────────────────────────────

export type WsConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

export interface WsMessage<T = unknown> {
  topic: string
  payload: T
  timestamp: string
}

// ─── Architecture Types ───────────────────────────────────────────────────────

export interface ArchNode {
  id: string
  label: string
  type: 'service' | 'broker' | 'database' | 'frontend' | 'gateway'
  status: ServiceStatus
  description: string
}

export interface ArchEdge {
  from: string
  to: string
  label?: string
  animated?: boolean
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

// ─── Dashboard State ──────────────────────────────────────────────────────────

export interface DashboardState {
  logs: LogEntry[]
  services: Service[]
  alerts: Alert[]
  insights: AIInsight[]
  metrics: OverviewMetric[]
  chartData: ChartDataPoint[]
  wsStatus: WsConnectionStatus
  isLoading: boolean
  error: string | null
}

// ─── Filter Types ─────────────────────────────────────────────────────────────

export interface LogFilter {
  level?: LogLevel | 'ALL'
  service?: string | 'ALL'
  search?: string
  startTime?: string
  endTime?: string
}

export interface AlertFilter {
  severity?: AlertSeverity | 'ALL'
  acknowledged?: boolean
}
