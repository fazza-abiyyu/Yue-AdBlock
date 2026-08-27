import type { RouteConfig } from '../../lib/endpoint/index.js';

export const metadataRoutes: RouteConfig[] = [
  {
    method: 'GET',
    path: '/adblock/metadata',
    handler: 'get',
    tags: ['AdBlock'],
    responses: [{ status: 200, description: 'Metadata retrieved' }],
  },
];
