import type { HandlerContext } from '../../lib/endpoint/index.js';
import { AdblockService } from './adblock.service.js';
import { ODataError } from '../../lib/exception/index.js';
import { ODataResponse } from '../../lib/odata/index.js';

export class AdblockController {
  constructor(private readonly adblockService: AdblockService) {}

  getPolicy(ctx: HandlerContext) {
    const profile = (ctx.query?.profile as string) ?? 'balanced';
    const policy = this.adblockService.getPolicy(profile);
    if (!policy)
      throw new ODataError('POLICY_NOT_FOUND', `Policy profile '${profile}' not found`, 404);
    ctx.set.status = 200;
    return ODataResponse.item(policy).context('$metadata#EntitySet').build();
  }

  getProfiles(ctx: HandlerContext) {
    const profiles = this.adblockService.listProfiles();
    ctx.set.status = 200;
    return ODataResponse.collection(profiles).context('$metadata#EntitySet').build();
  }

  getRule(ctx: HandlerContext) {
    const params = (ctx as unknown as { params: Record<string, string> }).params;
    const ruleName = params?.ruleName ?? '';
    const content = this.adblockService.getRuleContent(ruleName);
    if (!content) throw new ODataError('RULE_NOT_FOUND', `Rule file '${ruleName}' not found`, 404);
    ctx.set.headers = { 'Content-Type': 'text/plain; charset=utf-8' };
    ctx.set.status = 200;
    return content;
  }

  private getPath(ctx: HandlerContext): string {
    return (ctx as unknown as { path?: string }).path ?? '/';
  }
}
