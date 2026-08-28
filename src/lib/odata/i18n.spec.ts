import { describe, expect, test } from 'bun:test';
import { odataI18n } from './i18n.js';

describe('ODataI18n', () => {
  test('returns default message when no translations registered', () => {
    const translate = odataI18n.getTranslator();
    const result = translate('NOT_FOUND', undefined, { defaultMessage: 'Not found' });
    expect(result).toBe('Not found');
  });

  test('returns translation for registered lang', () => {
    odataI18n.register('id', { NOT_FOUND: 'Tidak ditemukan' });
    const translate = odataI18n.getTranslator();
    const result = translate('NOT_FOUND', 'id', { defaultMessage: 'Not found' });
    expect(result).toBe('Tidak ditemukan');
  });

  test('falls back to defaultMessage for unregistered lang', () => {
    const translate = odataI18n.getTranslator();
    const result = translate('NOT_FOUND', 'fr', { defaultMessage: 'Not found' });
    expect(result).toBe('Not found');
  });

  test('falls back to defaultMessage for unregistered code', () => {
    odataI18n.register('id', { NOT_FOUND: 'Tidak ditemukan' });
    const translate = odataI18n.getTranslator();
    const result = translate('SOME_OTHER', 'id', { defaultMessage: 'Some other' });
    expect(result).toBe('Some other');
  });

  test('merges translations for same lang', () => {
    odataI18n.register('en', { A: 'Alpha' });
    odataI18n.register('en', { B: 'Bravo' });
    const translate = odataI18n.getTranslator();
    expect(translate('A', 'en', { defaultMessage: '' })).toBe('Alpha');
    expect(translate('B', 'en', { defaultMessage: '' })).toBe('Bravo');
  });

  test('passes target to translateFn params', () => {
    const translate = odataI18n.getTranslator();
    const result = translate('ERR', undefined, { target: '/foo', defaultMessage: 'Error on /foo' });
    expect(result).toBe('Error on /foo');
  });
});
