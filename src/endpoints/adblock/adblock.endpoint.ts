import type { RouteConfig } from '../../lib/endpoint/index.js';

export const adblockRoutes: RouteConfig[] = [
  {
    method: 'GET',
    path: '/adblock/policy',
    handler: 'getPolicy',
    tags: ['AdBlock'],
    responses: [{ status: 200, description: 'Policy retrieved' }],
  },
  {
    method: 'GET',
    path: '/adblock/profiles',
    handler: 'getProfiles',
    tags: ['AdBlock'],
    responses: [{ status: 200, description: 'Profiles listed' }],
  },
  {
    method: 'GET',
    path: '/adblock/rules/:ruleName',
    handler: 'getRule',
    tags: ['AdBlock'],
    responses: [{ status: 200, description: 'Rule file retrieved' }],
  },
];
