import { dictionaries, type Language, type TranslationKey } from './translations';

export * from './translations';
export * from './resolveLanguage';

export type Translate = (key: TranslationKey, vars?: Record<string, string | number>) => string;

/**
 * Substitutes `{name}` placeholders. Missing keys fall back to English rather
 * than rendering a raw key at the user.
 */
export function translate(
  language: Language,
  key: TranslationKey,
  vars?: Record<string, string | number>,
): string {
  const template = dictionaries[language]?.[key] ?? dictionaries.en[key] ?? key;
  if (!vars) return template;

  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}

export function createTranslator(language: Language): Translate {
  return (key, vars) => translate(language, key, vars);
}
