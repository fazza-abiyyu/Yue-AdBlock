import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const featureNameArg = process.argv[2];

if (!featureNameArg) {
  console.error('Usage: bun run scripts/generate-module.ts <feature-name>');
  process.exit(1);
}

const feature = featureNameArg.toLowerCase();
const PascalName = feature.charAt(0).toUpperCase() + feature.slice(1);

const srcPath = join(process.cwd(), 'src');
const moduleDir = join(srcPath, 'modules', feature);
const endpointDir = join(srcPath, 'endpoints', feature);

if (existsSync(moduleDir) || existsSync(endpointDir)) {
  console.error(`Error: Module or Endpoint directory for "${feature}" already exists.`);
  process.exit(1);
}

mkdirSync(moduleDir, { recursive: true });
mkdirSync(endpointDir, { recursive: true });

console.log(`Generating module and endpoints for "${feature}"...`);

// 1. *.interface.ts
const interfaceContent = `export interface ${PascalName}Response {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
`;
writeFileSync(join(moduleDir, `${feature}.interface.ts`), interfaceContent, 'utf-8');
console.log(`  → Created ${feature}.interface.ts`);

// 2. *.i18n.ts
const i18nContent = `import { odataI18n } from '../../lib/odata/index.js';

export function register${PascalName}Translations(): void {
  odataI18n.register('id', {
    ${PascalName}NotFound: '${PascalName} tidak ditemukan',
  });

  odataI18n.register('en', {
    ${PascalName}NotFound: '${PascalName} not found',
  });
}
`;
writeFileSync(join(moduleDir, `${feature}.i18n.ts`), i18nContent, 'utf-8');
console.log(`  → Created ${feature}.i18n.ts`);

// 3. *.service.ts
const serviceContent = `import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { config } from '../../infrastructure/config/index.js';

export class ${PascalName}Service {
  private dataDir = join(config.publicDir, '${feature}');

  list(): Record<string, unknown>[] {
    try {
      if (!existsSync(this.dataDir)) return [];
      const files = readdirSync(this.dataDir).filter((f) => f.endsWith('.json'));
      return files.map((f) => {
        const raw = readFileSync(join(this.dataDir, f), 'utf-8');
        return JSON.parse(raw);
      });
    } catch {
      return [];
    }
  }

  get(name: string): unknown {
    try {
      const filePath = join(this.dataDir, \`\${name}.json\`);
      if (!existsSync(filePath)) return null;
      return JSON.parse(readFileSync(filePath, 'utf-8'));
    } catch {
      return null;
    }
  }
}
`;
writeFileSync(join(moduleDir, `${feature}.service.ts`), serviceContent, 'utf-8');
console.log(`  → Created ${feature}.service.ts`);

// 4. *.controller.ts
const controllerContent = `import type { HandlerContext } from '../../lib/endpoint/index.js';
import { ${PascalName}Service } from './${feature}.service.js';
import { ODataError } from '../../lib/exception/index.js';
import { ODataResponse } from '../../lib/odata/index.js';

export class ${PascalName}Controller {
  constructor(private readonly ${feature}Service: ${PascalName}Service) {}

  list(ctx: HandlerContext) {
    const items = this.${feature}Service.list();
    ctx.set.status = 200;
    return ODataResponse.collection(items).context('$metadata#EntitySet').build();
  }

  get(ctx: HandlerContext) {
    const name = ctx.params.name ?? '';
    const item = this.${feature}Service.get(name);
    if (!item) throw new ODataError('${PascalName.toUpperCase()}_NOT_FOUND', '${PascalName} not found', 404);
    ctx.set.status = 200;
    return ODataResponse.item(item).context('$metadata#EntitySet').build();
  }
}
`;
writeFileSync(join(moduleDir, `${feature}.controller.ts`), controllerContent, 'utf-8');
console.log(`  → Created ${feature}.controller.ts`);

// 5. *.module.ts
const moduleContent = `import type { Elysia } from 'elysia';
import { register${PascalName}Translations } from './${feature}.i18n.js';
import { ${PascalName}Service } from './${feature}.service.js';
import { ${PascalName}Controller } from './${feature}.controller.js';
import { ${feature}Routes } from '../../endpoints/${feature}/${feature}.endpoint.js';
import { mountRoutes } from '../../lib/endpoint/index.js';

export function build${PascalName}Module(app: Elysia): Elysia {
  register${PascalName}Translations();
  const ${feature}Service = new ${PascalName}Service();
  const ${feature}Controller = new ${PascalName}Controller(${feature}Service);
  return mountRoutes(app, ${feature}Controller, ${feature}Routes);
}
`;
writeFileSync(join(moduleDir, `${feature}.module.ts`), moduleContent, 'utf-8');
console.log(`  → Created ${feature}.module.ts`);

// 6. index.ts (Module)
const moduleIndexContent = `export * from './${feature}.interface.js';
export * from './${feature}.service.js';
export * from './${feature}.controller.js';
export * from './${feature}.module.js';
`;
writeFileSync(join(moduleDir, 'index.ts'), moduleIndexContent, 'utf-8');
console.log(`  → Created module/index.ts`);

// 7. *.endpoint.ts
const endpointContent = `import type { RouteConfig } from '../../lib/endpoint/index.js';

export const ${feature}Routes: RouteConfig[] = [
  {
    method: 'GET',
    path: '/${feature}',
    handler: 'list',
    tags: ['${PascalName}'],
    responses: [{ status: 200, description: '${PascalName} list' }],
  },
  {
    method: 'GET',
    path: '/${feature}/:name',
    handler: 'get',
    tags: ['${PascalName}'],
    responses: [
      { status: 200, description: '${PascalName} retrieved' },
      { status: 404, description: '${PascalName} not found' },
    ],
  },
];
`;
writeFileSync(join(endpointDir, `${feature}.endpoint.ts`), endpointContent, 'utf-8');
console.log(`  → Created ${feature}.endpoint.ts`);

// 8. index.ts (Endpoint)
const endpointIndexContent = `export * from './${feature}.endpoint.js';
`;
writeFileSync(join(endpointDir, 'index.ts'), endpointIndexContent, 'utf-8');
console.log(`  → Created endpoint/index.ts`);

console.log(`\nDone! Generated module and endpoints for "${feature}".`);
console.log(`Don't forget to register the module in src/modules/registry.ts.`);
