export interface ServiceStatus {
  id: string;
  serviceName: string;
  status: string;
  baseUrl: string;
  responseTime: number;
  lastChecked: string;
}