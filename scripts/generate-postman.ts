import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { z } from 'zod';
import { routeRegistry } from '../src/endpoints/registry.js';
import type { RouteConfig } from '../src/lib/endpoint/index.js';
import { config } from '../src/infrastructure/config/index.js';
import { healthScenarios, adblockScenarios, metadataScenarios } from './postman/index.js';

const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'));
const appName = pkg.name ?? 'unnamed';
const baseUrl = `http://localhost:${config.port}`;

interface Scenario {
  name: string;
  query?: Record<string, string>;
  params?: Record<string, string>;
  body?: Record<string, unknown>;
  expect: { status: number; body?: Record<string, unknown> };
  tests?: string[];
}

export interface CustomScenario extends Scenario {}

const customScenarios: Record<string, CustomScenario[]> = {
  ...healthScenarios,
  ...adblockScenarios,
  ...metadataScenarios,
};

function endpointKey(route: RouteConfig): string {
  return `${route.method} ${route.path}`;
}

function findSuccessStatus(route: RouteConfig): number {
  if (!route.responses?.length) return route.method === 'POST' ? 201 : 200;
  const successCodes = route.responses.filter((r) => r.status < 400).map((r) => r.status);
  return successCodes.length > 0 ? Math.min(...successCodes) : route.method === 'POST' ? 201 : 200;
}

function generateExample(schema: z.ZodTypeAny, fieldName?: string): unknown {
  if (schema instanceof z.ZodObject) {
    const result: Record<string, unknown> = {};
    for (const [key, valueSchema] of Object.entries(schema.shape)) {
      result[key] = generateExample(valueSchema as z.ZodTypeAny, key);
    }
    return result;
  }
  if (schema instanceof z.ZodString) {
    if (fieldName?.toLowerCase().includes('email')) return 'user@example.com';
    return 'string';
  }
  if (schema instanceof z.ZodNumber) return 1;
  if (schema instanceof z.ZodBoolean) return true;
  if (schema instanceof z.ZodArray) return [generateExample(schema.element as unknown as z.ZodTypeAny)];
  if (schema instanceof z.ZodEnum) return schema.options[0];
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable || schema instanceof z.ZodDefault) {
    const inner = 'unwrap' in schema ? schema.unwrap() : (schema as { _def?: { innerType?: unknown } })._def?.innerType;
    return generateExample(inner as unknown as z.ZodTypeAny, fieldName);
  }
  if (schema instanceof z.ZodLiteral) return schema.value;
  if (schema instanceof z.ZodUnion) return generateExample(schema.options[0] as unknown as z.ZodTypeAny, fieldName);
  return null;
}

function generateScenarios(route: RouteConfig): Scenario[] {
  const key = endpointKey(route);
  if (customScenarios[key]) return customScenarios[key];

  const scenarios: Scenario[] = [];
  const successStatus = findSuccessStatus(route);
  const success: Scenario = { name: 'Success', expect: { status: successStatus } };
  if (route.schema?.body) success.body = generateExample(route.schema.body) as Record<string, unknown>;
  if (route.schema?.query) {
    const example = generateExample(route.schema.query) as Record<string, string>;
    if (example) success.query = example;
  }
  if (route.schema?.params) {
    const example = generateExample(route.schema.params) as Record<string, string>;
    if (example) success.params = example;
  }
  scenarios.push(success);

  for (const res of route.responses ?? []) {
    if (res.status === successStatus || res.status >= 500) continue;
    const scenario: Scenario = {
      name: res.description ?? `Status ${res.status}`,
      expect: { status: res.status },
    };
    scenarios.push(scenario);
  }
  return scenarios;
}

function buildTestScript(status: number, body?: Record<string, unknown>, customTests?: string[]): string {
  const assertions: string[] = [`pm.response.to.have.status(${status})`];
  if (body) {
    for (const [key, value] of Object.entries(body)) {
      const parts = key.split('.');
      const accessor = parts.map((p) => (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(p) ? `.${p}` : `[${JSON.stringify(p)}]`)).join('');
      assertions.push(`pm.expect(pm.response.json()${accessor}).eql(${JSON.stringify(value)})`);
    }
  }
  if (customTests) assertions.push(...customTests);
  return assertions.join(';\n');
}

function buildQueryString(query?: Record<string, string>): string {
  if (!query) return '';
  return '?' + new URLSearchParams(query).toString();
}

function folderName(path: string): string {
  return path.split('/').filter(Boolean)[0] ?? 'ungrouped';
}

function buildItem(route: RouteConfig, scenario: Scenario): Record<string, unknown> {
  let resolvedPath = route.path;
  if (scenario.params) {
    for (const [key, value] of Object.entries(scenario.params)) {
      resolvedPath = resolvedPath.replace(`:${key}`, value);
    }
  }
  resolvedPath = resolvedPath.replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, (_match, name) => `example-${name}`);
  const path = resolvedPath + buildQueryString(scenario.query);
  const testScript = buildTestScript(scenario.expect.status, scenario.expect.body, scenario.tests);

  const request: Record<string, unknown> = {
    method: route.method,
    header: [],
    url: {
      raw: `{{baseUrl}}${path}`,
      host: ['{{baseUrl}}'],
      path: path.split('/').filter(Boolean),
    },
  };

  return {
    name: `${route.method} ${path}`,
    event: [{ listen: 'test', script: { exec: testScript.split('\n'), type: 'text/javascript' } }],
    request,
  };
}

function generate(): void {
  const folders = new Map<string, Record<string, unknown>[]>();

  for (const route of routeRegistry) {
    const folder = folderName(route.path);
    if (!folders.has(folder)) folders.set(folder, []);
    for (const scenario of generateScenarios(route)) {
      folders.get(folder)!.push(buildItem(route, scenario));
    }
  }

  const items: Record<string, unknown>[] = [];
  for (const [name, children] of folders) {
    items.push({ name, item: children });
  }

  const collection = {
    info: { name: appName, description: 'Auto-generated from endpoint configs', schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json' },
    item: items,
    variable: [{ key: 'baseUrl', value: baseUrl, type: 'string' }],
  };

  const outDir = join(process.cwd(), 'postman');
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  const outputPath = join(outDir, `${appName}.postman_collection.json`);
  writeFileSync(outputPath, JSON.stringify(collection, null, 2), 'utf-8');
  console.log(`→ Generated ${outputPath}`);
}

generate();
