import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { config } from '../../infrastructure/config/index.js';
import type { PolicyResponse, ProfileInfo } from './adblock.interface.js';

export class AdblockService {
  private policiesDir = join(config.publicDir, 'policies');
  private rulesDir = join(config.publicDir, 'rules');

  getPolicy(profile: string): PolicyResponse | null {
    try {
      const policyPath = join(this.policiesDir, `${profile}.json`);
      if (!existsSync(policyPath)) return null;
      const raw = readFileSync(policyPath, 'utf-8');
      return JSON.parse(raw) as PolicyResponse;
    } catch {
      return null;
    }
  }

  listProfiles(): ProfileInfo[] {
    try {
      if (!existsSync(this.policiesDir)) return [];
      const files = readdirSync(this.policiesDir).filter((f) => f.endsWith('.json'));
      return files.map((f) => {
        try {
          const raw = readFileSync(join(this.policiesDir, f), 'utf-8');
          const p = JSON.parse(raw);
          return {
            id: f.replace('.json', ''),
            name: p.name ?? f.replace('.json', ''),
            description: p.description ?? '',
            isDefault: f.replace('.json', '') === 'balanced',
          };
        } catch {
          return {
            id: f.replace('.json', ''),
            name: f.replace('.json', ''),
            description: '',
            isDefault: false,
          };
        }
      });
    } catch {
      return [];
    }
  }

  getRuleContent(ruleName: string): string | null {
    try {
      const rulePath = join(this.rulesDir, ruleName);
      if (!existsSync(rulePath)) return null;
      return readFileSync(rulePath, 'utf-8');
    } catch {
      return null;
    }
  }
}
