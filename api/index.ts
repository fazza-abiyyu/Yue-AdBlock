import { Elysia } from 'elysia';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const publicDir = join(process.cwd(), 'public', 'adblock');

function getMetadata() {
  try {
    const p = join(publicDir, 'metadata.json');
    if (!existsSync(p)) return null;
    return JSON.parse(readFileSync(p, 'utf-8'));
  } catch { return null; }
}

function getPolicy(profile: string) {
  try {
    const p = join(publicDir, 'policies', `${profile}.json`);
    if (!existsSync(p)) return null;
    return JSON.parse(readFileSync(p, 'utf-8'));
  } catch { return null; }
}

function listProfiles() {
  try {
    const { readdirSync } = require('fs');
    const dir = join(publicDir, 'policies');
    if (!existsSync(dir)) return [];
    return readdirSync(dir).filter((f: string) => f.endsWith('.json')).map((f: string) => f.replace('.json', ''));
  } catch { return []; }
}

function getRuleContent(ruleName: string) {
  try {
    const p = join(publicDir, 'rules', ruleName);
    if (!existsSync(p)) return null;
    return readFileSync(p, 'utf-8');
  } catch { return null; }
}

const app = new Elysia({ prefix: '/api' });

app.get('/health', () => ({
  status: 'healthy',
  version: '1.0.0',
  uptime: Math.floor(Date.now() / 1000),
  timestamp: new Date().toISOString(),
}));

app.get('/adblock/metadata', (ctx) => {
  const metadata = getMetadata();
  if (!metadata) { ctx.set.status = 404; return { error: 'Metadata not found' }; }
  ctx.set.status = 200;
  return { '@odata.context': '$metadata#EntitySet', item: metadata, code: 200, message: 'OK' };
});

app.get('/adblock/policy', (ctx) => {
  const url = new URL(ctx.request.url);
  const profile = url.searchParams.get('profile') ?? 'balanced';
  const policy = getPolicy(profile);
  if (!policy) { ctx.set.status = 404; return { error: `Policy profile '${profile}' not found` }; }
  ctx.set.status = 200;
  return { '@odata.context': '$metadata#EntitySet', item: policy, code: 200, message: 'OK' };
});

app.get('/adblock/profiles', (ctx) => {
  const profiles = listProfiles();
  ctx.set.status = 200;
  return { '@odata.context': '$metadata#EntitySet', item: { profiles }, code: 200, message: 'OK' };
});

app.get('/adblock/rules/:ruleName', (ctx) => {
  const params = (ctx as unknown as { params?: Record<string, string> }).params;
  const ruleName = params?.ruleName ?? '';
  const content = getRuleContent(ruleName);
  if (!content) { ctx.set.status = 404; return { error: `Rule file '${ruleName}' not found` }; }
  ctx.set.headers = { 'Content-Type': 'text/plain; charset=utf-8' };
  ctx.set.status = 200;
  return content;
});

const handler = app.fetch.bind(app);
export default handler;
