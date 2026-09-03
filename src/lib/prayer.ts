/**
 * Prayer time calculation.
 *
 * Wraps the `adhan` library (the same high-precision astronomical model used by
 * most well-regarded prayer apps) in the small, UI-shaped API the screens need.
 * Everything runs on-device: no network, no account, no server.
 *
 * Pure module — no React or React Native imports — so it is unit testable.
 */

import {
  CalculationMethod,
  Coordinates,
  HighLatitudeRule,
  Madhab,
  PolarCircleResolution,
  PrayerTimes,
  Rounding,
} from 'adhan';

/** The six times shown in the timetable. Sunrise is informational, not a prayer. */
export const PRAYER_SLOTS = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;
export type PrayerSlot = (typeof PRAYER_SLOTS)[number];

/** Sunrise is displayed but never announced or counted down to as a prayer. */
export const NOTIFIABLE_SLOTS: readonly PrayerSlot[] = [
  'fajr',
  'dhuhr',
  'asr',
  'maghrib',
  'isha',
];

/**
 * Methods offered in Settings, in the order they are listed.
 *
 * `adhan` exposes a couple more (including a placeholder `Other`); the app
 * deliberately derives its method type from this list rather than from the
 * library's, so a method can never be selected or stored that has no name to
 * show the user in all three languages.
 */
export const SELECTABLE_METHODS = [
  'MuslimWorldLeague',
  'Turkey',
  'Egyptian',
  'UmmAlQura',
  'Karachi',
  'NorthAmerica',
  'Dubai',
  'Kuwait',
  'Qatar',
  'Singapore',
  'Tehran',
  'MoonsightingCommittee',
] as const satisfies readonly (keyof typeof CalculationMethod)[];

export type CalculationMethodKey = (typeof SELECTABLE_METHODS)[number];

/**
 * The two Asr conventions: `shafi` is the first shadow length (Shafi‘i, Maliki
 * and Hanbali, and what most authorities print), `hanafi` the second.
 */
export type MadhabKey = 'shafi' | 'hanafi';

export interface Position {
  latitude: number;
  longitude: number;
}

/**
 * Everything the calculation depends on besides place and date. There is no
 * Asr choice: each authority publishes one Asr, and the method carries it.
 */
export interface PrayerSettings {
  method: CalculationMethodKey;
}

export interface PrayerEntry {
  slot: PrayerSlot;
  time: Date;
  /** False for sunrise, which is a marker rather than a prayer. */
  isPrayer: boolean;
}

export interface DayTimetable {
  /** Local calendar day these times were computed for. */
  date: Date;
  entries: PrayerEntry[];
}

/**
 * The convention each country's own authority publishes, so a user who never
 * opens Settings still sees the timetable posted at their local mosque.
 */
const METHOD_BY_REGION: Record<string, CalculationMethodKey> = {
  TR: 'Turkey',
  US: 'NorthAmerica',
  CA: 'NorthAmerica',
  SA: 'UmmAlQura',
  YE: 'UmmAlQura',
  EG: 'Egyptian',
  SD: 'Egyptian',
  LY: 'Egyptian',
  SY: 'Egyptian',
  JO: 'Egyptian',
  LB: 'Egyptian',
  IQ: 'Egyptian',
  PK: 'Karachi',
  IN: 'Karachi',
  BD: 'Karachi',
  AF: 'Karachi',
  // Sri Lanka's Muslims are largely Shafi‘i and its timetables print the
  // first-shadow Asr, so it must not inherit Karachi's Hanafi Asr.
  LK: 'MuslimWorldLeague',
  AE: 'Dubai',
  KW: 'Kuwait',
  QA: 'Qatar',
  BH: 'Qatar',
  OM: 'Qatar',
  SG: 'Singapore',
  MY: 'Singapore',
  ID: 'Singapore',
  BN: 'Singapore',
  IR: 'Tehran',
  GB: 'MoonsightingCommittee',
};

export function defaultMethodForRegion(region: string | undefined): CalculationMethodKey {
  if (!region) return 'MuslimWorldLeague';
  return METHOD_BY_REGION[region.toUpperCase()] ?? 'MuslimWorldLeague';
}

/**
 * The Asr convention each authority publishes.
 *
 * An Asr choice used to sit in Settings next to the method, and it was a trap:
 * Diyanet prints the first-shadow İkindi although Türkiye is Hanafi, so a
 * Turkish user who tapped "Hanafi" saw an Asr an hour after the adhan every
 * mosque in the country calls. The authority's timetable is the whole point
 * of choosing the authority, so the method now carries its Asr as well.
 *
 * Only the Karachi method departs from the first shadow: the timetables of
 * Pakistan, India, Bangladesh and Afghanistan all print the Hanafi Asr.
 */
const ASR_CONVENTION_BY_METHOD: Record<CalculationMethodKey, MadhabKey> = {
  MuslimWorldLeague: 'shafi',
  Turkey: 'shafi',
  Egyptian: 'shafi',
  UmmAlQura: 'shafi',
  Karachi: 'hanafi',
  NorthAmerica: 'shafi',
  Dubai: 'shafi',
  Kuwait: 'shafi',
  Qatar: 'shafi',
  Singapore: 'shafi',
  Tehran: 'shafi',
  MoonsightingCommittee: 'shafi',
};

/** The Asr convention the method's authority publishes. */
export function asrConventionFor(method: CalculationMethodKey): MadhabKey {
  return ASR_CONVENTION_BY_METHOD[method] ?? 'shafi';
}

function buildParameters(position: Position, settings: PrayerSettings) {
  const factory = CalculationMethod[settings.method] ?? CalculationMethod.MuslimWorldLeague;
  const params = factory();

  params.madhab = asrConventionFor(settings.method) === 'hanafi' ? Madhab.Hanafi : Madhab.Shafi;

  // Above roughly 48° latitude the sun may never reach the twilight angle that
  // defines Fajr and Isha. These two rules keep the timetable sane there, and
  // are no-ops at lower latitudes.
  params.highLatitudeRule = HighLatitudeRule.recommended(
    new Coordinates(position.latitude, position.longitude),
  );
  params.polarCircleResolution = PolarCircleResolution.AqrabBalad;

  // Timetables are published to the minute, so round rather than truncate.
  params.rounding = Rounding.Nearest;

  return params;
}

/** Computes the six times for the local calendar day containing `date`. */
export function getDayTimetable(
  position: Position,
  settings: PrayerSettings,
  date: Date,
): DayTimetable {
  const coordinates = new Coordinates(position.latitude, position.longitude);
  const times = new PrayerTimes(coordinates, date, buildParameters(position, settings));

  const entries: PrayerEntry[] = PRAYER_SLOTS.map((slot) => ({
    slot,
    time: times[slot],
    isPrayer: slot !== 'sunrise',
  }));

  return { date: startOfDay(date), entries };
}

export interface UpcomingPrayer {
  slot: PrayerSlot;
  time: Date;
  /** True when the prayer falls on the day after `now`. */
  isTomorrow: boolean;
  /** Milliseconds until it begins; never negative. */
  msRemaining: number;
}

/**
 * The next prayer to count down to, given a day's timetable and the following
 * day's Fajr to roll over to after Isha. Sunrise is skipped: nothing begins at
 * sunrise.
 *
 * Takes a precomputed timetable so the countdown can tick once a second
 * without redoing the solar calculation each time.
 */
export function selectNextPrayer(
  today: DayTimetable,
  tomorrowFajr: Date,
  now: Date,
): UpcomingPrayer {
  for (const entry of today.entries) {
    if (entry.isPrayer && entry.time.getTime() > now.getTime()) {
      return {
        slot: entry.slot,
        time: entry.time,
        isTomorrow: false,
        msRemaining: entry.time.getTime() - now.getTime(),
      };
    }
  }

  return {
    slot: 'fajr',
    time: tomorrowFajr,
    isTomorrow: true,
    msRemaining: Math.max(0, tomorrowFajr.getTime() - now.getTime()),
  };
}

/**
 * The prayer period currently in force, used to highlight a row in the
 * timetable. Returns `undefined` before Fajr, when the active period belongs to
 * the previous day's Isha.
 */
export function selectCurrentPrayer(today: DayTimetable, now: Date): PrayerSlot | undefined {
  let current: PrayerSlot | undefined;
  for (const entry of today.entries) {
    if (entry.time.getTime() <= now.getTime()) {
      current = entry.slot;
    }
  }
  return current;
}

/** Tomorrow's Fajr, for rolling the countdown over after Isha. */
export function getTomorrowFajr(
  position: Position,
  settings: PrayerSettings,
  now: Date,
): Date {
  const { entries } = getDayTimetable(position, settings, addDays(now, 1));
  const fajr = entries.find((entry) => entry.slot === 'fajr');

  // `adhan` always produces a Fajr time, including via the polar-circle
  // resolution above, so this fallback is defensive only.
  return fajr?.time ?? addDays(now, 1);
}

/** Convenience wrapper that computes the timetable itself. */
export function getNextPrayer(
  position: Position,
  settings: PrayerSettings,
  now: Date,
): UpcomingPrayer {
  return selectNextPrayer(
    getDayTimetable(position, settings, now),
    getTomorrowFajr(position, settings, now),
    now,
  );
}

/** Convenience wrapper that computes the timetable itself. */
export function getCurrentPrayer(
  position: Position,
  settings: PrayerSettings,
  now: Date,
): PrayerSlot | undefined {
  return selectCurrentPrayer(getDayTimetable(position, settings, now), now);
}

/**
 * Every prayer instant in the next `days` days, ordered, starting from `from`.
 * Used to lay out the rolling notification schedule.
 */
export function getUpcomingPrayers(
  position: Position,
  settings: PrayerSettings,
  from: Date,
  days: number,
): { slot: PrayerSlot; time: Date }[] {
  const result: { slot: PrayerSlot; time: Date }[] = [];

  for (let offset = 0; offset < days; offset += 1) {
    const { entries } = getDayTimetable(position, settings, addDays(from, offset));
    for (const entry of entries) {
      if (entry.isPrayer && entry.time.getTime() > from.getTime()) {
        result.push({ slot: entry.slot, time: entry.time });
      }
    }
  }

  return result;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date.getTime());
  next.setDate(next.getDate() + days);
  return next;
}

export function startOfDay(date: Date): Date {
  const start = new Date(date.getTime());
  start.setHours(0, 0, 0, 0);
  return start;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
