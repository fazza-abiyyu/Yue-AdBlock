import type { Elysia } from 'elysia';
import { registerAdblockTranslations } from './adblock.i18n.js';
import { AdblockService } from './adblock.service.js';
import { AdblockController } from './adblock.controller.js';
import { adblockRoutes } from '../../endpoints/adblock/adblock.endpoint.js';
import { mountRoutes } from '../../lib/endpoint/index.js';

export function buildAdblockModule(app: Elysia): Elysia {
  registerAdblockTranslations();
  const adblockService = new AdblockService();
  const adblockController = new AdblockController(adblockService);
  return mountRoutes(app, adblockController, adblockRoutes);
}
