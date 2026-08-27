import { odataI18n } from '../../lib/odata/index.js';

export function registerMetadataTranslations(): void {
  odataI18n.register('id', {
    MetadataNotFound: 'Metadata tidak ditemukan',
  });
  odataI18n.register('en', {
    MetadataNotFound: 'Metadata not found',
  });
}
