import type { HandlerContext } from '../../lib/endpoint/index.js';
import { HealthService } from './health.service.js';

export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  live(ctx: HandlerContext) {
    const correlationId = (ctx.headers['x-correlation-id'] as string) || undefined;
    return this.healthService.live({ correlationId });
  }

  ready(ctx: HandlerContext) {
    const correlationId = (ctx.headers['x-correlation-id'] as string) || undefined;
    return this.healthService.ready({ correlationId });
  }
}
