import { odataI18n } from '../../lib/odata/index.js';

export function registerHealthTranslations(): void {
  odataI18n.register('id', {
    ServiceUnhealthy: 'Layanan tidak sehat',
  });
  odataI18n.register('en', {
    ServiceUnhealthy: 'Service is unhealthy',
  });
}
