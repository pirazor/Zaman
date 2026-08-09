/**
 * Time and date formatting.
 *
 * Clock times are formatted by hand rather than through `Intl`, because
 * Hermes' `Intl` support varies by platform and a prayer time that renders as
 * "١٤:٣٠" on one phone and "2:30 PM" on another is worse than one that is
 * always unambiguous. Western digits are legible to readers of all three
 * supported languages.
 *
 * Pure module — no React or React Native imports — so it is unit testable.
 */

import type { Language } from '../i18n/translations';

export type TimeFormat = '12h' | '24h';

/** Regions that conventionally read a 12-hour clock. */
const TWELVE_HOUR_REGIONS = new Set(['US', 'CA', 'AU', 'NZ', 'PH', 'IN', 'PK', 'BD', 'EG', 'SA']);

export function defaultTimeFormat(region: string | undefined): TimeFormat {
  return region && TWELVE_HOUR_REGIONS.has(region.toUpperCase()) ? '12h' : '24h';
}

/** e.g. `18:42` or `6:42 PM`. */
export function formatTime(date: Date, format: TimeFormat): string {
  const hours = date.getHours();
  const minutes = pad(date.getMinutes());

  if (format === '24h') return `${pad(hours)}:${minutes}`;

  const suffix = hours < 12 ? 'AM' : 'PM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${minutes} ${suffix}`;
}

/**
 * Countdown text: `1:23:45` past an hour, `23:45` under one. Hours are not
 * zero-padded so the display does not jump width when crossing 10 hours.
 */
export function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
}

const DATE_LOCALES: Record<Language, string> = {
  en: 'en-GB',
  tr: 'tr-TR',
  ar: 'ar',
};

/** e.g. `Saturday, 9 August`. Falls back to a plain numeric date. */
export function formatGregorianDate(date: Date, language: Language): string {
  try {
    return new Intl.DateTimeFormat(DATE_LOCALES[language], {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(date);
  } catch {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }
}

/**
 * e.g. `15 Safar 1448`. Returns `undefined` when the runtime's `Intl` build
 * lacks the Islamic calendar, in which case callers simply omit the line.
 */
export function formatHijriDate(date: Date, language: Language): string | undefined {
  try {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    // A runtime whose Intl build lacks the Islamic calendar silently formats a
    // Gregorian date instead. Comparing the year it reports against the
    // Gregorian one catches that: the two are centuries apart. The probe runs
    // in English so the year comes back in Western digits and parses.
    const probe = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', options).formatToParts(date);
    const year = Number(probe.find((part) => part.type === 'year')?.value);
    if (!Number.isFinite(year) || Math.abs(year - date.getFullYear()) < 100) {
      return undefined;
    }

    return new Intl.DateTimeFormat(
      `${DATE_LOCALES[language]}-u-ca-islamic-umalqura`,
      options,
    ).format(date);
  } catch {
    return undefined;
  }
}

function pad(value: number): string {
  return value < 10 ? `0${value}` : String(value);
}
