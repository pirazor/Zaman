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

/**
 * The 24-hour clock is the app-wide default: it is the convention prayer
 * timetables are published in, and it never confuses an early Isha with an
 * early Fajr. The 12-hour clock remains one tap away in Settings.
 * (The region parameter is kept so callers don't churn if this becomes
 * regional again.)
 */
export function defaultTimeFormat(_region: string | undefined): TimeFormat {
  return '24h';
}

/**
 * The hour and minute a moment shows on the wall clock of `timeZone` —
 * needed whenever the timetable belongs to a hand-picked city rather than
 * where the phone is. Falls back to the device clock if the runtime does not
 * know the zone.
 */
function wallClock(date: Date, timeZone: string | undefined): { hours: number; minutes: number } {
  if (timeZone) {
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour: 'numeric',
        minute: 'numeric',
        hourCycle: 'h23',
      }).formatToParts(date);
      const hours = Number(parts.find((part) => part.type === 'hour')?.value);
      const minutes = Number(parts.find((part) => part.type === 'minute')?.value);
      if (Number.isFinite(hours) && Number.isFinite(minutes)) return { hours, minutes };
    } catch {
      // Unknown zone: fall through to the device clock.
    }
  }
  return { hours: date.getHours(), minutes: date.getMinutes() };
}

/**
 * A `Date` whose device-local calendar fields equal the calendar date of
 * `now` in `timeZone`. The solar calculation reads only those fields, so this
 * is what "compute the timetable for that city's today" means — without it, a
 * user west of the city sees yesterday's or tomorrow's table near midnight.
 */
export function dateInTimeZone(now: Date, timeZone: string | undefined): Date {
  if (!timeZone) return now;
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }).formatToParts(now);
    const year = Number(parts.find((part) => part.type === 'year')?.value);
    const month = Number(parts.find((part) => part.type === 'month')?.value);
    const day = Number(parts.find((part) => part.type === 'day')?.value);
    if (Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day)) {
      return new Date(year, month - 1, day, 12, 0, 0);
    }
  } catch {
    // Unknown zone: the device day is the best remaining answer.
  }
  return now;
}

/**
 * Meridiem markers by language. Turkish reads öğleden önce/sonra as ÖÖ/ÖS;
 * Arabic uses ص (صباحاً) and م (مساءً).
 */
const MERIDIEM: Record<Language, [am: string, pm: string]> = {
  en: ['AM', 'PM'],
  tr: ['ÖÖ', 'ÖS'],
  ar: ['ص', 'م'],
};

/** e.g. `18:42`, `6:42 PM`, `6:42 ÖS`, `6:42 م` — on `timeZone`'s clock if given. */
export function formatTime(
  date: Date,
  format: TimeFormat,
  language: Language,
  timeZone?: string,
): string {
  const { hours, minutes } = wallClock(date, timeZone);
  const paddedMinutes = pad(minutes);

  if (format === '24h') return `${pad(hours)}:${paddedMinutes}`;

  const suffix = MERIDIEM[language][hours < 12 ? 0 : 1];
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${paddedMinutes} ${suffix}`;
}

const DATE_LOCALES: Record<Language, string> = {
  en: 'en-GB',
  tr: 'tr-TR',
  ar: 'ar',
};

/** e.g. `Saturday, 9 August`. Falls back to a plain numeric date. */
export function formatGregorianDate(date: Date, language: Language, timeZone?: string): string {
  try {
    return new Intl.DateTimeFormat(DATE_LOCALES[language], {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      ...(timeZone ? { timeZone } : null),
    }).format(date);
  } catch {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }
}

/**
 * e.g. `15 Safar 1448`. Returns `undefined` when the runtime's `Intl` build
 * lacks the Islamic calendar, in which case callers simply omit the line.
 */
export function formatHijriDate(
  date: Date,
  language: Language,
  timeZone?: string,
): string | undefined {
  try {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      ...(timeZone ? { timeZone } : null),
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
