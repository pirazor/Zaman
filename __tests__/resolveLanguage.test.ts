import {
  isSupportedLanguage,
  resolveDefaultLanguage,
  resolveRegion,
  type LocaleLike,
} from '../src/i18n/resolveLanguage';

const locale = (partial: Partial<LocaleLike>): LocaleLike => ({
  languageCode: null,
  regionCode: null,
  languageRegionCode: null,
  currencyCode: null,
  ...partial,
});

describe('resolveDefaultLanguage', () => {
  it('uses Turkish in Turkey', () => {
    expect(resolveDefaultLanguage([locale({ languageCode: 'tr', regionCode: 'TR' })])).toBe('tr');
  });

  it('uses English in the United States', () => {
    expect(resolveDefaultLanguage([locale({ languageCode: 'en', regionCode: 'US' })])).toBe('en');
  });

  it('uses Arabic everywhere else', () => {
    expect(resolveDefaultLanguage([locale({ languageCode: 'fr', regionCode: 'FR' })])).toBe('ar');
    expect(resolveDefaultLanguage([locale({ languageCode: 'ms', regionCode: 'MY' })])).toBe('ar');
    expect(resolveDefaultLanguage([locale({ languageCode: 'ur', regionCode: 'PK' })])).toBe('ar');
  });

  it('follows the region, not the language, inside Turkey and the US', () => {
    // An English speaker living in Turkey sees the Turkish timetable
    // conventions their neighbours use, and vice versa.
    expect(resolveDefaultLanguage([locale({ languageCode: 'en', regionCode: 'TR' })])).toBe('tr');
    expect(resolveDefaultLanguage([locale({ languageCode: 'ar', regionCode: 'US' })])).toBe('en');
  });

  it('treats a Turkish-language device outside Turkey as Turkish', () => {
    expect(resolveDefaultLanguage([locale({ languageCode: 'tr', regionCode: 'DE' })])).toBe('tr');
  });

  it('falls back to the store currency when the region is missing', () => {
    // iOS reports the currency from the same Region setting the App Store
    // storefront follows, so it identifies the two special-cased regions
    // even when regionCode comes back null.
    expect(resolveDefaultLanguage([locale({ languageCode: 'en', currencyCode: 'USD' })])).toBe('en');
    expect(resolveDefaultLanguage([locale({ languageCode: 'en', currencyCode: 'TRY' })])).toBe('tr');
  });

  it('falls back to the language list when there is no region at all', () => {
    expect(resolveDefaultLanguage([locale({ languageCode: 'en' })])).toBe('en');
    expect(resolveDefaultLanguage([locale({ languageCode: 'tr' })])).toBe('tr');
    expect(resolveDefaultLanguage([locale({ languageCode: 'de' })])).toBe('ar');
  });

  it('reads later locales when the first has no region or supported language', () => {
    expect(
      resolveDefaultLanguage([locale({ languageCode: 'de' }), locale({ languageCode: 'en' })]),
    ).toBe('en');
  });

  it('is case and separator insensitive', () => {
    expect(resolveDefaultLanguage([locale({ languageCode: 'TR-tr', regionCode: 'tr' })])).toBe('tr');
    expect(resolveDefaultLanguage([locale({ regionCode: 'us' })])).toBe('en');
  });

  it('defaults to Arabic when the device reports nothing usable', () => {
    expect(resolveDefaultLanguage([])).toBe('ar');
    expect(resolveDefaultLanguage(undefined)).toBe('ar');
    expect(resolveDefaultLanguage([locale({})])).toBe('ar');
  });
});

describe('resolveRegion', () => {
  it('prefers the explicit region code', () => {
    expect(resolveRegion([locale({ regionCode: 'gb', currencyCode: 'USD' })])).toBe('GB');
  });

  it('falls back through later locales', () => {
    expect(resolveRegion([locale({}), locale({ regionCode: 'EG' })])).toBe('EG');
  });

  it('returns undefined when nothing identifies a country', () => {
    expect(resolveRegion([locale({ languageCode: 'de' })])).toBeUndefined();
    expect(resolveRegion([])).toBeUndefined();
  });
});

describe('isSupportedLanguage', () => {
  it('accepts only the three shipped languages', () => {
    expect(isSupportedLanguage('en')).toBe(true);
    expect(isSupportedLanguage('tr')).toBe(true);
    expect(isSupportedLanguage('ar')).toBe(true);
    expect(isSupportedLanguage('de')).toBe(false);
    expect(isSupportedLanguage(undefined)).toBe(false);
  });
});
