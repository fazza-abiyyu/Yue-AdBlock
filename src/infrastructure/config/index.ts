import { z } from 'zod';

const configSchema = z.object({
  port: z.coerce.number().default(3000),
  databaseUrl: z.string().default('postgresql://localhost:5432/yue_adblock'),
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
});

export const config = configSchema.parse({
  port: process.env['PORT'] ?? 3000,
  databaseUrl: process.env['DATABASE_URL'] ?? 'postgresql://localhost:5432/yue_adblock',
  nodeEnv: process.env['NODE_ENV'] ?? 'development',
});
