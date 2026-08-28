import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { routeRegistry } from '../src/endpoints/registry.js';
import type { RouteConfig } from '../src/lib/endpoint/index.js';
import { config } from '../src/infrastructure/config/index.js';

const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'));
const appName = pkg.name ?? 'unnamed';
const API_BASE_URL = `http://localhost:${config.port}`;

interface OpenApiPathItem {
  tags?: string[];
  summary?: string;
  operationId?: string;
  parameters?: OpenApiParameter[];
  responses: Record<string, OpenApiResponse>;
}

interface OpenApiParameter {
  name: string;
  in: 'path' | 'query' | 'header';
  required: boolean;
  schema: Record<string, unknown>;
}

interface OpenApiResponse {
  description?: string;
  content?: Record<string, { schema: Record<string, unknown> }>;
}

function isOptionalSchema(schema: unknown): boolean {
  const name = (schema as { constructor?: { name?: string } })?.constructor?.name;
  return name === 'ZodOptional' || name === 'ZodDefault' || name === 'ZodNullable';
}

function zodToJsonSchema(schema: unknown): Record<string, unknown> {
  const s = schema as { _def?: any; constructor?: { name?: string }; shape?: Record<string, unknown> };
  if (!s || typeof s !== 'object' || !s._def) return {};
  const def = s._def;
  const name = s.constructor?.name;

  switch (name) {
    case 'ZodObject': {
      const properties: Record<string, unknown> = {};
      const required: string[] = [];
      for (const [key, value] of Object.entries(s.shape ?? {})) {
        properties[key] = zodToJsonSchema(value);
        if (!isOptionalSchema(value)) required.push(key);
      }
      const result: Record<string, unknown> = { type: 'object', properties };
      if (required.length > 0) result.required = required;
      return result;
    }
    case 'ZodString': return { type: 'string' };
    case 'ZodNumber': return { type: 'number' };
    case 'ZodBoolean': return { type: 'boolean' };
    case 'ZodEnum': return { type: 'string', enum: def.values };
    case 'ZodArray': return { type: 'array', items: zodToJsonSchema(def.type) };
    case 'ZodOptional': return zodToJsonSchema(def.innerType);
    case 'ZodNullable': return { ...zodToJsonSchema(def.innerType), nullable: true };
    case 'ZodDefault': return zodToJsonSchema(def.innerType);
    case 'ZodLiteral': return { const: def.value };
    case 'ZodUnion': return { anyOf: def.options.map((o: unknown) => zodToJsonSchema(o)) };
    default: return { type: 'object' };
  }
}

function pathToOpenApi(rawPath: string): string {
  return rawPath.replace(/\/:([a-zA-Z_][a-zA-Z0-9_]*)/g, '/{$1}');
}

function extractPathParams(rawPath: string): string[] {
  const params: string[] = [];
  const regex = /\/:([a-zA-Z_][a-zA-Z0-9_]*)/g;
  let match;
  while ((match = regex.exec(rawPath)) !== null) params.push(match[1]);
  return params;
}

function buildParameters(route: RouteConfig): OpenApiParameter[] {
  const params: OpenApiParameter[] = [
    { name: 'X-Correlation-Id', in: 'header', required: false, schema: { type: 'string', format: 'uuid' } },
  ];
  for (const name of extractPathParams(route.path)) {
    params.push({ name, in: 'path', required: true, schema: { type: 'string' } });
  }
  if (route.schema?.query) {
    const resolved = zodToJsonSchema(route.schema.query);
    for (const [name, schema] of Object.entries((resolved.properties ?? {}) as Record<string, unknown>)) {
      params.push({ name, in: 'query', required: false, schema: schema as Record<string, unknown> });
    }
  }
  return params;
}

function buildResponses(route: RouteConfig): Record<string, OpenApiResponse> {
  const responses: Record<string, OpenApiResponse> = {};
  const successStatus = route.method === 'POST' ? 201 : 200;
  for (const res of route.responses ?? []) {
    responses[res.status.toString()] = {
      description: res.description ?? '',
      content: res.status >= 200 && res.status < 300
        ? { 'application/json': { schema: { type: 'object', properties: { value: { type: 'object' } }, required: ['value'] } } }
        : { 'application/json': { schema: { $ref: '#/components/schemas/ODataErrorResponse' } } },
    };
  }
  if (!responses['500']) {
    responses['500'] = { description: 'Internal server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ODataErrorResponse' } } } };
  }
  return responses;
}

function generate(): void {
  const paths: Record<string, Record<string, OpenApiPathItem>> = {};
  const sorted = [...routeRegistry].sort((a, b) => a.path.localeCompare(b.path));

  for (const route of sorted) {
    const openApiPath = pathToOpenApi(route.path);
    const method = route.method.toLowerCase();
    if (!paths[openApiPath]) paths[openApiPath] = {};
    const parameters = buildParameters(route);
    paths[openApiPath][method] = {
      tags: route.tags,
      summary: `${route.method} ${route.path}`,
      operationId: `${route.handler}${route.path.replace(/[^a-zA-Z0-9]/g, '_')}`,
      parameters: parameters.length > 0 ? parameters : undefined,
      responses: buildResponses(route),
    };
  }

  const spec = {
    openapi: '3.1.0',
    info: { title: appName, version: '1.0.0', description: 'Yue AdBlock — Remote adblock policy & filter rule server' },
    servers: [{ url: API_BASE_URL }],
    paths,
    components: {
      schemas: {
        ODataErrorResponse: {
          type: 'object',
          properties: { error: { type: 'object', properties: { code: { type: 'string' }, message: { type: 'string' } }, required: ['code', 'message'] } },
          required: ['error'],
        },
      },
    },
  };

  const outDir = join(process.cwd(), 'openapi');
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  const outputPath = join(outDir, `${appName}.openapi.json`);
  writeFileSync(outputPath, JSON.stringify(spec, null, 2), 'utf-8');
  console.log(`→ Generated ${outputPath} (${routeRegistry.length} routes)`);
}

generate();
