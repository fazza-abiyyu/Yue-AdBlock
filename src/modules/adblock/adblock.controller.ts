import { Elysia, type Context } from 'elysia';
import { adblockService } from './adblock.service';
import { odataSingle } from '../../lib/odata/response';

function getQueryParam(ctx: Context, name: string): string | undefined {
  const url = new URL(ctx.request.url);
  return url.searchParams.get(name) ?? undefined;
}

function getPathParam(ctx: Context, name: string): string | undefined {
  const url = new URL(ctx.request.url);
  // Extract path segment for the param
  const pathParts = url.pathname.split('/');
  const routeMap: Record<string, number> = {};
  // Simple heuristic: find the param by matching route pattern
  // We know the patterns: /adblock/rules/:ruleName
  if (pathParts.length >= 4 && pathParts[1] === 'adblock' && pathParts[2] === 'rules') {
    routeMap['ruleName'] = 3; // 0-indexed: / adblock rules <value>
  }
  const idx = routeMap[name];
  return idx !== undefined ? decodeURIComponent(pathParts[idx] ?? '') : undefined;
}

export class AdblockController {
  register(app: Elysia) {
    app.get('/adblock/metadata', (ctx) => {
      const metadata = adblockService.getMetadata();
      if (!metadata) {
        ctx.set.status = 404;
        return { error: 'Metadata not found' };
      }
      return odataSingle(metadata);
    });

    app.get('/adblock/policy', (ctx) => {
      const profile = getQueryParam(ctx, 'profile') ?? 'balanced';
      const policy = adblockService.getPolicy(profile);
      if (!policy) {
        ctx.set.status = 404;
        return { error: `Policy profile '${profile}' not found` };
      }
      return odataSingle(policy);
    });

    app.get('/adblock/profiles', (ctx) => {
      const profiles = adblockService.listProfiles();
      return odataSingle({ profiles });
    });

    app.get('/adblock/rules/:ruleName', (ctx) => {
      const params = (ctx as unknown as { params?: Record<string, string> }).params;
      const ruleName = params?.ruleName ?? getPathParam(ctx, 'ruleName') ?? '';
      const ruleContent = adblockService.getRuleContent(ruleName);
      if (!ruleContent) {
        ctx.set.status = 404;
        return { error: `Rule file '${ruleName}' not found` };
      }
      ctx.set.headers = { 'Content-Type': 'text/plain; charset=utf-8' };
      ctx.set.status = 200;
      return ruleContent;
    });
  }
}
