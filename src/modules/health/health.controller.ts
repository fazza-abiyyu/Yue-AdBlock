import { Elysia, type Context } from 'elysia';
import { healthService } from './health.service';
import { odataSingle } from '../../lib/odata/response';

export class HealthController {
  register(app: Elysia) {
    app.get('/health', (ctx) => {
      return odataSingle(healthService.getHealth());
    });
  }
}
