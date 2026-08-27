import { Elysia, type Context } from 'elysia';
import { metadataService } from './metadata.service';
import { odataSingle } from '../../lib/odata/response';

export class MetadataController {
  register(app: Elysia) {
    app.get('/metadata', (ctx) => {
      return odataSingle(metadataService.getMetadata());
    });
  }
}
