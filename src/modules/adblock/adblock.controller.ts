import { Elysia, type Context } from 'elysia';
import { adblockService } from './adblock.service';
import { odataSingle } from '../../lib/odata/response';

type PolicyQuery = { query: { profile?: string } };
type RuleParams = { params: { ruleName: string } };

export class AdblockController {
  register(app: Elysia) {
    app.group('/adblock', (adblock) => {
      adblock.get('/metadata', this.getMetadata.bind(this));
      adblock.get('/policy', this.getPolicy.bind(this));
      adblock.get('/profiles', this.listProfiles.bind(this));
      adblock.get('/rules/:ruleName', this.getRule.bind(this));
      return adblock;
    });
  }

  private getMetadata(ctx: Context) {
    const metadata = adblockService.getMetadata();
    if (!metadata) {
      ctx.set.status = 404;
      return { error: 'Metadata not found' };
    }
    return odataSingle(metadata);
  }

  private getPolicy(ctx: Context & PolicyQuery) {
    const profile = ctx.query.profile ?? 'balanced';
    const policy = adblockService.getPolicy(profile);
    if (!policy) {
      ctx.set.status = 404;
      return { error: `Policy profile '${profile}' not found` };
    }
    return odataSingle(policy);
  }

  private listProfiles(ctx: Context) {
    const profiles = adblockService.listProfiles();
    return odataSingle({ profiles });
  }

  private getRule(ctx: Context & RuleParams) {
    const ruleContent = adblockService.getRuleContent(ctx.params.ruleName);
    if (!ruleContent) {
      ctx.set.status = 404;
      return { error: `Rule file '${ctx.params.ruleName}' not found` };
    }
    ctx.set.headers = { 'Content-Type': 'text/plain; charset=utf-8' };
    ctx.set.status = 200;
    return ruleContent;
  }
}
