import { Elysia, type Context } from 'elysia';

export interface Endpoint {
  prefix: string;
  register(app: Elysia): void;
}

export abstract class BaseEndpoint implements Endpoint {
  abstract prefix: string;
  abstract register(app: Elysia): void;

  protected success<T>(ctx: Context, data: T, message = 'OK') {
    ctx.set.status = 200;
    return {
      status: 'success' as const,
      code: 200,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  protected created<T>(ctx: Context, data: T, message = 'Created') {
    ctx.set.status = 201;
    return {
      status: 'success' as const,
      code: 201,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  protected error(ctx: Context, status: number, code: string, message: string, details?: unknown) {
    ctx.set.status = status;
    return {
      status: 'error' as const,
      code,
      message,
      details,
      timestamp: new Date().toISOString(),
    };
  }
}
