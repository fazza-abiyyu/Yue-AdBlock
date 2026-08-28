import { describe, expect, test } from 'bun:test';
import { AdblockService } from './adblock.service.js';

describe('AdblockService', () => {
  const service = new AdblockService();

  describe('getPolicy', () => {
    test('returns balanced policy', () => {
      const policy = service.getPolicy('balanced') as any;
      expect(policy).not.toBeNull();
      expect(policy!.profile).toBe('balanced');
      expect(policy!.riskScoring.blockThreshold).toBe(80);
    });

    test('returns aggressive policy', () => {
      const policy = service.getPolicy('aggressive') as any;
      expect(policy).not.toBeNull();
      expect(policy!.profile).toBe('aggressive');
      expect(policy!.riskScoring.blockThreshold).toBe(60);
    });

    test('returns streaming policy', () => {
      const policy = service.getPolicy('streaming') as any;
      expect(policy).not.toBeNull();
      expect(policy!.profile).toBe('streaming');
      expect(policy!.riskScoring.blockThreshold).toBe(80);
    });

    test('returns null for nonexistent profile', () => {
      const policy = service.getPolicy('nonexistent');
      expect(policy).toBeNull();
    });
  });

  describe('listProfiles', () => {
    test('returns array of profiles', () => {
      const profiles = service.listProfiles();
      expect(Array.isArray(profiles)).toBe(true);
      expect(profiles.length).toBeGreaterThan(0);
    });

    test('includes balanced profile', () => {
      const profiles = service.listProfiles();
      const balanced = profiles.find((p) => p.id === 'balanced');
      expect(balanced).toBeDefined();
      expect(balanced!.isDefault).toBe(true);
    });

    test('includes aggressive profile', () => {
      const profiles = service.listProfiles();
      const aggressive = profiles.find((p) => p.id === 'aggressive');
      expect(aggressive).toBeDefined();
    });

    test('includes streaming profile', () => {
      const profiles = service.listProfiles();
      const streaming = profiles.find((p) => p.id === 'streaming');
      expect(streaming).toBeDefined();
    });

    test('each profile has required fields', () => {
      const profiles = service.listProfiles();
      for (const profile of profiles) {
        expect(profile.id).toBeDefined();
        expect(profile.name).toBeDefined();
        expect(typeof profile.description).toBe('string');
        expect(typeof profile.isDefault).toBe('boolean');
      }
    });
  });

  describe('getRuleContent', () => {
    test('returns content for existing rule', () => {
      const content = service.getRuleContent('ad_domains.txt');
      expect(content).not.toBeNull();
      expect(typeof content).toBe('string');
      expect(content!.length).toBeGreaterThan(0);
    });

    test('returns video_ads.txt rule file', () => {
      const content = service.getRuleContent('video_ads.txt');
      expect(content).not.toBeNull();
      expect(content).toContain('.video-ads');
    });

    test('returns anti_adblock_selectors.txt rule file', () => {
      const content = service.getRuleContent('anti_adblock_selectors.txt');
      expect(content).not.toBeNull();
      expect(content).toContain('.adblock-warning');
    });

    test('returns popup_ads.txt rule file', () => {
      const content = service.getRuleContent('popup_ads.txt');
      expect(content).not.toBeNull();
      expect(content).toContain('.popup-ad');
    });

    test('returns null for nonexistent rule', () => {
      const content = service.getRuleContent('nonexistent.txt');
      expect(content).toBeNull();
    });
  });
});
