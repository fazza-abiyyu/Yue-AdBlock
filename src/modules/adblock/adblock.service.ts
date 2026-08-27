import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { AdblockPolicy, StrategyMetadata } from './adblock.interface';

export class AdblockService {
  private readonly publicDir = join(process.cwd(), 'public', 'adblock');

  getMetadata(): StrategyMetadata | null {
    try {
      const filePath = join(this.publicDir, 'metadata.json');
      if (!existsSync(filePath)) return null;
      const content = readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as StrategyMetadata;
    } catch {
      return null;
    }
  }

  getPolicy(profile: string): AdblockPolicy | null {
    try {
      const filePath = join(this.publicDir, 'policies', `${profile}.json`);
      if (!existsSync(filePath)) return null;
      const content = readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as AdblockPolicy;
    } catch {
      return null;
    }
  }

  listProfiles(): string[] {
    try {
      const { readdirSync } = require('fs');
      const policiesDir = join(this.publicDir, 'policies');
      if (!existsSync(policiesDir)) return [];
      return readdirSync(policiesDir)
        .filter((f: string) => f.endsWith('.json'))
        .map((f: string) => f.replace('.json', ''));
    } catch {
      return [];
    }
  }

  getRuleContent(ruleName: string): string | null {
    try {
      const filePath = join(this.publicDir, 'rules', ruleName);
      if (!existsSync(filePath)) return null;
      return readFileSync(filePath, 'utf-8');
    } catch {
      return null;
    }
  }
}

export const adblockService = new AdblockService();
