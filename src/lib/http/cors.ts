import { config } from '../../infrastructure/config/index.js';

const ALLOWED_HEADERS = 'Content-Type, Authorization, X-Tenant-Id, X-Correlation-Id, Accept';
const ALLOWED_METHODS = 'GET, POST, PATCH, PUT, DELETE, OPTIONS';

function resolveOrigin(requestOrigin: string | null): string | null {
  const allowed = config.corsOrigins;
  if (allowed.includes('*')) return requestOrigin ?? '*';
  if (requestOrigin && allowed.includes(requestOrigin)) return requestOrigin;
  return null;
}

export function withCors(app: any): any {
  return app
    .onRequest(({ request, set }: { request: Request; set: any }) => {
      const origin = resolveOrigin(request.headers.get('origin'));
      if (!origin) return;

      set.headers['access-control-allow-origin'] = origin;
      set.headers['access-control-allow-credentials'] = 'true';
      set.headers.vary = 'Origin';

      if (request.method === 'OPTIONS') {
        set.headers['access-control-allow-methods'] = ALLOWED_METHODS;
        set.headers['access-control-allow-headers'] =
          request.headers.get('access-control-request-headers') ?? ALLOWED_HEADERS;
        set.headers['access-control-max-age'] = '86400';
        set.status = 204;
        return new Response(null, { status: 204, headers: set.headers as HeadersInit });
      }
    })
    .onError(({ request, set }: { request: Request; set: any }) => {
      const origin = resolveOrigin(request.headers.get('origin'));
      if (origin) {
        set.headers['access-control-allow-origin'] = origin;
        set.headers['access-control-allow-credentials'] = 'true';
      }
    });
}
