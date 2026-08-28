import { describe, expect, test } from 'bun:test';
import { createApp } from '../../app.js';

describe('AdBlock Endpoints (Integration)', () => {
  const app = createApp();

  test('GET /health/live returns OData response', async () => {
    const res = await app.handle(new Request('http://localhost/health/live'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('data');
    expect(body.data.status).toBe('ok');
    expect(body.data.service).toBe('yue-adblock');
  });

  test('GET /health/ready returns OData response', async () => {
    const res = await app.handle(new Request('http://localhost/health/ready'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.status).toBe('ok');
  });

  test('GET /adblock/metadata returns metadata', async () => {
    const res = await app.handle(new Request('http://localhost/adblock/metadata'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('item');
    expect(body.item).toHaveProperty('profiles');
    expect(body.item.profiles).toContain('balanced');
  });

  test('GET /adblock/policy?profile=balanced returns balanced policy', async () => {
    const res = await app.handle(new Request('http://localhost/adblock/policy?profile=balanced'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.value.profile).toBe('balanced');
    expect(body.value.riskScoring.blockThreshold).toBe(80);
  });

  test('GET /adblock/policy?profile=aggressive returns aggressive policy', async () => {
    const res = await app.handle(new Request('http://localhost/adblock/policy?profile=aggressive'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.value.profile).toBe('aggressive');
    expect(body.value.riskScoring.blockThreshold).toBe(60);
  });

  test('GET /adblock/policy with invalid profile returns 404', async () => {
    const res = await app.handle(
      new Request('http://localhost/adblock/policy?profile=nonexistent'),
    );
    expect(res.status).toBe(404);
  });

  test('GET /adblock/profiles returns profile list', async () => {
    const res = await app.handle(new Request('http://localhost/adblock/profiles'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('value');
    expect(Array.isArray(body.value)).toBe(true);
    expect(body.value.length).toBeGreaterThan(0);
  });

  test('GET /adblock/rules/ad_domains.txt returns rule file', async () => {
    const res = await app.handle(new Request('http://localhost/adblock/rules/ad_domains.txt'));
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text.length).toBeGreaterThan(0);
  });

  test('GET /adblock/rules/nonexistent.txt returns 404', async () => {
    const res = await app.handle(new Request('http://localhost/adblock/rules/nonexistent.txt'));
    expect(res.status).toBe(404);
  });

  test('GET /nonexistent returns 404', async () => {
    const res = await app.handle(new Request('http://localhost/nonexistent'));
    expect(res.status).toBe(404);
  });
});
