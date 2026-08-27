import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { config } from '../../infrastructure/config/index.js';
import type { MetadataResponse } from './metadata.interface.js';

export class MetadataService {
  private metadataPath = join(config.publicDir, 'metadata.json');

  getMetadata(): MetadataResponse | null {
    try {
      if (!existsSync(this.metadataPath)) return null;
      const raw = readFileSync(this.metadataPath, 'utf-8');
      const parsed = JSON.parse(raw);

      const rulesDir = join(config.publicDir, 'rules');
      let rules: MetadataResponse['rules'] = [];
      try {
        if (existsSync(rulesDir)) {
          const files = readdirSync(rulesDir);
          rules = files.map((name) => {
            const content = readFileSync(join(rulesDir, name), 'utf-8');
            let hash = 0;
            for (let i = 0; i < content.length; i++) {
              hash = ((hash << 5) - hash + content.charCodeAt(i)) | 0;
            }
            return { name, hash: Math.abs(hash).toString(16), size: content.length };
          });
        }
      } catch { /* ignore */ }

      return {
        version: parsed.version ?? '1.0.0',
        engineVersion: parsed.engineVersion ?? '1.0.0',
        updatedAt: parsed.updatedAt ?? new Date().toISOString(),
        profiles: parsed.profiles ?? ['balanced', 'aggressive', 'minimal', 'anti-judol'],
        rules: parsed.rules ?? rules,
        features: parsed.features ?? {
          cookieBanner: true,
          webRtc: true,
          scriptlet: true,
          redirect: true,
        },
      };
    } catch {
      return null;
    }
  }
}
