import type { CustomScenario } from '../generate-postman.js';

export const healthScenarios: Record<string, CustomScenario[]> = {};

export const adblockScenarios: Record<string, CustomScenario[]> = {
  'GET /adblock/rules/:ruleName': [
    {
      name: 'GET /adblock/rules/ad_domains.txt — success',
      params: { ruleName: 'ad_domains.txt' },
      expect: { status: 200 },
      tests: [
        'pm.expect(pm.response.headers.get("content-type")).to.include("text/plain")',
        'pm.expect(pm.response.text()).to.have.length.above(0)',
      ],
    },
    {
      name: 'GET /adblock/rules/nonexistent.txt — 404',
      params: { ruleName: 'nonexistent.txt' },
      expect: { status: 404 },
    },
  ],
};

export const metadataScenarios: Record<string, CustomScenario[]> = {};
