import { readFileSync } from 'fs';
import { resolve } from 'path';
import { z } from 'zod';

let packageName = 'yue-adblock';
try {
  const pkg = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf-8'));
  packageName = pkg.name ?? 'yue-adblock';
} catch {
  // fallback
}

const publicDir = resolve(process.cwd(), 'public', 'adblock');

const envSchema = z.object({
  APP_NAME: z.string().default(packageName),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGINS: z.string().default('*'),
});

export type Env = z.infer<typeof envSchema>;
const parsed = envSchema.parse(process.env);

export const config = {
  env: parsed,
  appName: parsed.APP_NAME,
  port: parsed.PORT,
  nodeEnv: parsed.NODE_ENV,
  corsOrigins: parsed.CORS_ORIGINS.split(',')
    .map((o) => o.trim())
    .filter(Boolean),
  publicDir,
};
