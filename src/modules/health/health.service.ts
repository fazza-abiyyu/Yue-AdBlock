import { config } from '../../infrastructure/config/index.js';
import type { HealthResponse, HealthCheckOptions } from './health.interface.js';

export class HealthService {
  private generateMeta(correlationId?: string) {
    return {
      correlation_id: correlationId ?? null,
      request_id: Math.random().toString(36).substring(2, 15),
      idempotency_replayed: false,
      served_at: new Date().toISOString(),
    };
  }

  live(options?: HealthCheckOptions): HealthResponse {
    const status = {
      status: 'ok' as const,
      service: config.appName,
      version: process.env.npm_package_version ?? '0.0.1',
      checks: {} as Record<string, unknown>,
      observed_at: new Date().toISOString(),
    };
    return { data: status, meta: this.generateMeta(options?.correlationId) };
  }

  ready(options?: HealthCheckOptions): HealthResponse {
    const status = {
      status: 'ok' as const,
      service: config.appName,
      version: process.env.npm_package_version ?? '0.0.1',
      checks: { engine: { status: 'ok', message: 'AdBlock engine operational' } },
      observed_at: new Date().toISOString(),
    };
    return { data: status, meta: this.generateMeta(options?.correlationId) };
  }
}
