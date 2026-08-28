import type { Elysia } from 'elysia';
import { registerHealthTranslations } from './health.i18n.js';
import { HealthService } from './health.service.js';
import { HealthController } from './health.controller.js';
import { healthRoutes } from '../../endpoints/health/health.endpoint.js';
import { mountRoutes } from '../../lib/endpoint/index.js';

export function buildHealthModule(app: Elysia): Elysia {
  registerHealthTranslations();
  const healthService = new HealthService();
  const healthController = new HealthController(healthService);
  return mountRoutes(app, healthController, healthRoutes);
}
