import type { DurationSegment, DurationUnit } from '../lib/duration';
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

/**
 * The plural categories the app distinguishes. This is a deliberate subset of
 * CLDR: `two` is omitted because the countdown never needs Arabic's dual (see
 * the note beside the Arabic unit names), and no supported language needs
 * `zero`, since a zero-valued part is never rendered.
 */
export type PluralCategory = 'one' | 'few' | 'many';

export function pluralCategory(language: Language, count: number): PluralCategory {
  // Turkish nouns do not inflect after a numeral.
  if (language === 'tr') return 'many';

  if (language === 'ar') {
    if (count === 1) return 'one';
    const mod100 = count % 100;
    return mod100 >= 3 && mod100 <= 10 ? 'few' : 'many';
  }

  return count === 1 ? 'one' : 'many';
}

/** The name of a unit, inflected for the number in front of it. */
export function unitLabel(language: Language, unit: DurationUnit, count: number): string {
  return translate(language, `duration_${unit}_${pluralCategory(language, count)}`);
}

/**
 * The whole remaining time as one sentence — "1 hour 33 minutes".
 * Used for the screen reader, where the on-screen two-part layout would
 * otherwise be announced as two unrelated numbers.
 */
export function describeRemaining(
  language: Language,
  segments: readonly DurationSegment[],
): string {
  if (segments.length === 0) return translate(language, 'home_now');

  return segments
    .map((segment) => `${segment.value} ${unitLabel(language, segment.unit, segment.value)}`)
    .join(translate(language, 'duration_separator'));
}
