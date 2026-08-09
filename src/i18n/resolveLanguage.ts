/**
 * Picking the language a first-time user sees.
 *
 * The product rule is regional, not linguistic:
 *
 *   - Turkey (or a Turkish-speaking device)  -> Turkish
 *   - United States                          -> English
 *   - Everywhere else                        -> Arabic
 *
 * iOS exposes no public API for the App Store storefront without StoreKit, so
 * we use the device's Region setting (`regionCode`), which is what the store
 * account country tracks in practice, plus the region's currency as a
 * secondary signal for the same thing. Android has no storefront concept at
 * all and `regionCode` is the only meaningful input.
 *
 * This is only the *initial* value. Once a user picks a language in Settings
 * or on the welcome screen, that choice is stored and this is never consulted
 * again.
 *
 * Kept free of React Native imports so it can be unit tested in plain Node.
 */

import { LANGUAGES, type Language } from './translations';

/** The subset of `expo-localization`'s `Locale` this module needs. */
export interface LocaleLike {
  languageCode?: string | null;
  regionCode?: string | null;
  languageRegionCode?: string | null;
  currencyCode?: string | null;
}

const TURKEY_CURRENCY = 'TRY';
const US_CURRENCY = 'USD';

export function isSupportedLanguage(value: unknown): value is Language {
  return typeof value === 'string' && (LANGUAGES as readonly string[]).includes(value);
}

/**
 * Resolves the default language from the device's preferred locales, which
 * arrive in the user's own order of preference.
 */
export function resolveDefaultLanguage(locales: readonly LocaleLike[] | undefined): Language {
  if (!locales || locales.length === 0) return 'ar';

  const primary = locales[0];
  const primaryRegion = regionOf(primary);

  // Region wins over language: an English-speaking resident of Turkey gets the
  // Turkish timetable conventions their neighbours use, and vice versa in the US.
  if (primaryRegion === 'TR') return 'tr';
  if (primaryRegion === 'US') return 'en';

  // No usable region (common on Android when the user never set one): fall back
  // to the language of any locale they listed.
  if (!primaryRegion) {
    for (const locale of locales) {
      const language = normalize(locale.languageCode);
      if (language === 'tr') return 'tr';
      if (language === 'en') return 'en';
      if (language === 'ar') return 'ar';
    }
  }

  // A Turkish-language device outside Turkey is still a Turkish speaker.
  if (normalize(primary.languageCode) === 'tr') return 'tr';

  return 'ar';
}

/**
 * Best available guess at the user's country, used both for the language rule
 * above and for choosing a default prayer time calculation method.
 * Returns an upper-case ISO 3166-1 alpha-2 code, or `undefined`.
 */
export function resolveRegion(locales: readonly LocaleLike[] | undefined): string | undefined {
  if (!locales || locales.length === 0) return undefined;
  for (const locale of locales) {
    const region = regionOf(locale);
    if (region) return region;
  }
  return undefined;
}

function regionOf(locale: LocaleLike | undefined): string | undefined {
  if (!locale) return undefined;

  const region = upper(locale.regionCode) ?? upper(locale.languageRegionCode);
  if (region) return region;

  // On iOS the currency comes from the same Region setting the App Store uses,
  // so it identifies our two special-cased regions even when regionCode is null.
  const currency = upper(locale.currencyCode);
  if (currency === TURKEY_CURRENCY) return 'TR';
  if (currency === US_CURRENCY) return 'US';

  return undefined;
}

function upper(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed.toUpperCase() : undefined;
}

function normalize(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed.toLowerCase().split(/[-_]/)[0] : undefined;
}
