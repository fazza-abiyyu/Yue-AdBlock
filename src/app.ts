import { Elysia } from 'elysia';
import { AdblockController } from './modules/adblock/adblock.controller';
import { HealthController } from './modules/health/health.controller';
import { MetadataController } from './modules/metadata/metadata.controller';

export function createApp() {
  const app = new Elysia({ prefix: '/api' }) as unknown as Elysia;

  new HealthController().register(app);
  new MetadataController().register(app);
  new AdblockController().register(app);

  return app;
}

export const app = createApp();
