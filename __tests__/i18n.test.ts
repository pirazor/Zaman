import { createTranslator, translate } from '../src/i18n';
import { dictionaries, LANGUAGES, LANGUAGE_NAMES } from '../src/i18n/translations';
import { SELECTABLE_METHODS } from '../src/lib/prayer';

describe('dictionaries', () => {
  const englishKeys = Object.keys(dictionaries.en);

  it.each(LANGUAGES)('%s translates every key', (language) => {
    expect(Object.keys(dictionaries[language]).sort()).toEqual([...englishKeys].sort());
  });

  it.each(LANGUAGES)('%s leaves no string empty', (language) => {
    for (const [key, value] of Object.entries(dictionaries[language])) {
      expect(`${key}: ${value.trim()}`).not.toBe(`${key}: `);
    }
  });

  it.each(LANGUAGES)('%s keeps the placeholders each string needs', (language) => {
    const placeholders = (value: string) => (value.match(/\{(\w+)\}/g) ?? []).sort();

    for (const key of englishKeys as (keyof typeof dictionaries.en)[]) {
      // A missing or misspelt placeholder would render as literal "{minutes}"
      // in a notification, which is the kind of thing only a test catches.
      expect({ key, placeholders: placeholders(dictionaries[language][key]) }).toEqual({
        key,
        placeholders: placeholders(dictionaries.en[key]),
      });
    }
  });

  it('names every language in its own script', () => {
    expect(LANGUAGE_NAMES.en).toBe('English');
    expect(LANGUAGE_NAMES.tr).toBe('Türkçe');
    expect(LANGUAGE_NAMES.ar).toBe('العربية');
  });

  it('labels every calculation method offered in Settings', () => {
    for (const method of SELECTABLE_METHODS) {
      for (const language of LANGUAGES) {
        expect(dictionaries[language][`method_${method}`]).toBeTruthy();
      }
    }
  });

  it('names all six prayers in every language', () => {
    for (const slot of ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'] as const) {
      for (const language of LANGUAGES) {
        expect(dictionaries[language][`prayer_${slot}`]).toBeTruthy();
      }
    }
  });
});

describe('translate', () => {
  it('substitutes named placeholders', () => {
    expect(translate('en', 'settings_minutesBefore', { minutes: 15 })).toBe('15 minutes before');
    expect(translate('tr', 'settings_minutesBefore', { minutes: 15 })).toBe('15 dakika önce');
    expect(translate('ar', 'settings_minutesBefore', { minutes: 15 })).toBe('قبل 15 دقيقة');
  });

  it('fills every placeholder in a notification', () => {
    const title = translate('en', 'notification_title', { prayer: 'Maghrib', minutes: 15 });
    expect(title).toBe('Maghrib in 15 minutes');
    expect(title).not.toMatch(/[{}]/);
  });

  it('leaves an unknown placeholder in place rather than printing "undefined"', () => {
    expect(translate('en', 'notification_title', { prayer: 'Fajr' })).toBe('Fajr in {minutes} minutes');
  });

  it('returns the raw string when there is nothing to substitute', () => {
    expect(translate('en', 'tabs_qibla')).toBe('Qibla');
  });

  it('creates a translator bound to one language', () => {
    const t = createTranslator('tr');
    expect(t('tabs_qibla')).toBe('Kıble');
    expect(t('prayer_maghrib')).toBe('Akşam');
  });
});
