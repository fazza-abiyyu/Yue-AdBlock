import { app } from './app';
import { config } from './infrastructure/config';

app.listen(config.port, ({ hostname, port }) => {
  console.log(`[Yue AdBlock] Server running at http://${hostname}:${port}`);
  console.log(`[Yue AdBlock] API base: http://${hostname}:${port}/api`);
  console.log(`[Yue AdBlock] Environment: ${config.nodeEnv}`);
});
