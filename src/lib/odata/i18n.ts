import type { TranslateFn } from './types.js';

type TranslationMap = Record<string, string>;

class ODataI18n {
  private translations: Record<string, TranslationMap> = {};

  register(lang: string, translations: TranslationMap): void {
    if (!this.translations[lang]) this.translations[lang] = {};
    Object.assign(this.translations[lang], translations);
  }

  getTranslator(): TranslateFn {
    return (
      code: string,
      lang: string | undefined,
      params: { target?: string; defaultMessage: string },
    ) => {
      if (lang && this.translations[lang] && this.translations[lang][code]) {
        return this.translations[lang][code];
      }
      return params.defaultMessage;
    };
  }
}

export const odataI18n = new ODataI18n();
