import { createApp } from './app.js';
import { config } from './infrastructure/config/index.js';

const app = createApp();

const server = Bun.serve({
  fetch: app.fetch,
  port: config.port,
});

console.log(`Started server: ${server.protocol}://${server.hostname}:${server.port}`);
