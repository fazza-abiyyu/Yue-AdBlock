import type { HealthInfo } from './health.interface';

const startTime = Date.now();

export class HealthService {
  getHealth(): HealthInfo {
    return {
      status: 'healthy',
      version: '1.0.0',
      uptime: Math.floor((Date.now() - startTime) / 1000),
      timestamp: new Date().toISOString(),
    };
  }
}

export const healthService = new HealthService();
