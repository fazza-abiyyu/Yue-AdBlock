import { describe, expect, test } from 'bun:test';
import { HealthService } from './health.service.js';

describe('HealthService', () => {
  const service = new HealthService();

  describe('live', () => {
    test('returns ok status', () => {
      const result = service.live();
      expect(result.data.status).toBe('ok');
    });

    test('returns service name', () => {
      const result = service.live();
      expect(typeof result.data.service).toBe('string');
      expect(result.data.service.length).toBeGreaterThan(0);
    });

    test('returns version', () => {
      const result = service.live();
      expect(typeof result.data.version).toBe('string');
    });

    test('returns observed_at as ISO string', () => {
      const result = service.live();
      expect(new Date(result.data.observed_at).toISOString()).toBe(result.data.observed_at);
    });

    test('returns meta with correlation_id null by default', () => {
      const result = service.live();
      expect(result.meta.correlation_id).toBeNull();
    });

    test('returns meta with correlation_id when provided', () => {
      const result = service.live({ correlationId: 'abc-123' });
      expect(result.meta.correlation_id).toBe('abc-123');
    });

    test('returns meta with request_id', () => {
      const result = service.live();
      expect(typeof result.meta.request_id).toBe('string');
      expect(result.meta.request_id!.length).toBeGreaterThan(0);
    });

    test('meta idempotency_replayed is false', () => {
      const result = service.live();
      expect(result.meta.idempotency_replayed).toBe(false);
    });
  });

  describe('ready', () => {
    test('returns ok status', () => {
      const result = service.ready();
      expect(result.data.status).toBe('ok');
    });

    test('returns checks with engine', () => {
      const result = service.ready();
      expect(result.data.checks.engine).toBeDefined();
      expect((result.data.checks.engine as { status: string }).status).toBe('ok');
    });

    test('returns correlation_id when provided', () => {
      const result = service.ready({ correlationId: 'xyz-789' });
      expect(result.meta.correlation_id).toBe('xyz-789');
    });
  });
});
