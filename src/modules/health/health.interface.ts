export interface HealthInfo {
  status: 'healthy' | 'unhealthy';
  version: string;
  uptime: number;
  timestamp: string;
}
