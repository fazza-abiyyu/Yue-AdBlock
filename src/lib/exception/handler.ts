import type { Context } from 'elysia';

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(ctx: Context, error: unknown) {
  if (error instanceof AppError) {
    ctx.set.status = error.statusCode;
    return {
      status: 'error',
      code: error.code,
      message: error.message,
      details: error.details,
      timestamp: new Date().toISOString(),
    };
  }

  if (error instanceof Error) {
    ctx.set.status = 500;
    return {
      status: 'error',
      code: 'INTERNAL_ERROR',
      message: error.message,
      timestamp: new Date().toISOString(),
    };
  }

  ctx.set.status = 500;
  return {
    status: 'error',
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
  };
}

export function notFoundError(resource: string, id?: string) {
  return new AppError(404, 'NOT_FOUND', `${resource} not found${id ? `: ${id}` : ''}`);
}

export function validationError(message: string, details?: unknown) {
  return new AppError(400, 'VALIDATION_ERROR', message, details);
}

export function unauthorizedError(message = 'Unauthorized') {
  return new AppError(401, 'UNAUTHORIZED', message);
}
