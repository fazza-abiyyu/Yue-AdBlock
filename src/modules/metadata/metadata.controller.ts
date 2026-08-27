import type { HandlerContext } from '../../lib/endpoint/index.js';
import { MetadataService } from './metadata.service.js';
import { ODataError } from '../../lib/exception/index.js';

export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}

  get(ctx: HandlerContext) {
    const metadata = this.metadataService.getMetadata();
    if (!metadata) throw new ODataError('METADATA_NOT_FOUND', 'Metadata not found', 404);
    ctx.set.status = 200;
    return { '@odata.context': '$metadata#EntitySet', item: metadata, code: 200, message: 'OK' };
  }
}
