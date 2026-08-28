import { describe, expect, test } from 'bun:test';
import { createApp } from '../src/app.js';

describe('e2e (app.handle)', () => {
  test('GET /health/live returns ok', async () => {
    const res = await createApp().handle(new Request('http://localhost/health/live'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.status).toBe('ok');
  });

  test('GET /health/ready returns ok', async () => {
    const res = await createApp().handle(new Request('http://localhost/health/ready'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.status).toBe('ok');
  });

  test('GET /adblock/metadata returns metadata', async () => {
    const res = await createApp().handle(new Request('http://localhost/adblock/metadata'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.item.profiles).toContain('balanced');
  });

  test('GET /adblock/policy returns balanced policy by default', async () => {
    const res = await createApp().handle(
      new Request('http://localhost/adblock/policy?profile=balanced'),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.value.profile).toBe('balanced');
  });

  test('GET /adblock/policy with invalid profile returns 404', async () => {
    const res = await createApp().handle(
      new Request('http://localhost/adblock/policy?profile=nonexistent'),
    );
    expect(res.status).toBe(404);
  });

  test('GET /adblock/profiles returns profiles', async () => {
    const res = await createApp().handle(new Request('http://localhost/adblock/profiles'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.value.length).toBeGreaterThan(0);
  });

  test('GET /adblock/rules/ad_domains.txt returns file', async () => {
    const res = await createApp().handle(
      new Request('http://localhost/adblock/rules/ad_domains.txt'),
    );
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text.length).toBeGreaterThan(0);
  });

  test('unknown route returns 404', async () => {
    const res = await createApp().handle(new Request('http://localhost/unknown'));
    expect(res.status).toBe(404);
  });
});
