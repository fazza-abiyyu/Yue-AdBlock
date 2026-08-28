import { healthRoutes } from './health/health.endpoint.js';
import { adblockRoutes } from './adblock/adblock.endpoint.js';
import { metadataRoutes } from './metadata/metadata.endpoint.js';
import type { RouteConfig } from '../lib/endpoint/index.js';

export const routeRegistry: RouteConfig[] = [...healthRoutes, ...adblockRoutes, ...metadataRoutes];
