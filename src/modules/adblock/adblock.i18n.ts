import { odataI18n } from '../../lib/odata/index.js';

export function registerAdblockTranslations(): void {
  odataI18n.register('id', {
    PolicyNotFound: 'Profil kebijakan tidak ditemukan',
    RuleNotFound: 'File aturan tidak ditemukan',
  });
  odataI18n.register('en', {
    PolicyNotFound: 'Policy profile not found',
    RuleNotFound: 'Rule file not found',
  });
}
