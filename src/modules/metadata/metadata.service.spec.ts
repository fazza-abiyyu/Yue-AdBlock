import { describe, expect, test } from 'bun:test';
import { MetadataService } from './metadata.service.js';

describe('MetadataService', () => {
  const service = new MetadataService();

  describe('getMetadata', () => {
    test('returns metadata object', () => {
      const metadata = service.getMetadata();
      expect(metadata).not.toBeNull();
    });

    test('returns version string', () => {
      const metadata = service.getMetadata();
      expect(typeof metadata!.version).toBe('string');
    });

    test('returns engineVersion string', () => {
      const metadata = service.getMetadata();
      expect(typeof metadata!.engineVersion).toBe('string');
    });

    test('returns profiles array', () => {
      const metadata = service.getMetadata();
      expect(Array.isArray(metadata!.profiles)).toBe(true);
      expect(metadata!.profiles.length).toBeGreaterThan(0);
    });

    test('returns rules as object with rule entries', () => {
      const metadata = service.getMetadata();
      expect(metadata!.rules).toBeDefined();
      expect(typeof metadata!.rules).toBe('object');
    });

    test('rules entries have version and hash', () => {
      const metadata = service.getMetadata();
      const rules = metadata!.rules as unknown as Record<string, { version: number; hash: string }>;
      for (const [name, rule] of Object.entries(rules)) {
        expect(typeof name).toBe('string');
        expect(typeof rule.hash).toBe('string');
      }
    });

    test('returns features object', () => {
      const metadata = service.getMetadata();
      expect(metadata!.features).toBeDefined();
      expect(typeof metadata!.features.cookieBanner).toBe('boolean');
      expect(typeof metadata!.features.webRtc).toBe('boolean');
      expect(typeof metadata!.features.scriptlet).toBe('boolean');
      expect(typeof metadata!.features.redirect).toBe('boolean');
    });
  });
});
