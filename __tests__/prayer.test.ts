import {
  defaultMethodForRegion,
  getDayTimetable,
  getTomorrowFajr,
  getUpcomingPrayers,
  NOTIFIABLE_SLOTS,
  PRAYER_SLOTS,
  selectCurrentPrayer,
  selectNextPrayer,
  type DayTimetable,
  type PrayerSettings,
} from '../src/lib/prayer';

const ISTANBUL = { latitude: 41.0082, longitude: 28.9784 };
const MAKKAH = { latitude: 21.4225, longitude: 39.8262 };
const TROMSO = { latitude: 69.6496, longitude: 18.956 };

/**
 * Midday UTC, so the local calendar day is 9 August 2026 in every timezone the
 * app will realistically run in. Assertions then compare absolute instants via
 * ISO strings and stay independent of the machine's own timezone.
 */
const AUG_9_2026 = new Date(Date.UTC(2026, 7, 9, 12, 0, 0));

const times = (timetable: DayTimetable) =>
  Object.fromEntries(timetable.entries.map((entry) => [entry.slot, entry.time.toISOString()]));

describe('getDayTimetable', () => {
  it('matches the Diyanet timetable published for Istanbul', () => {
    // Istanbul is UTC+3 in August, so these are 04:20, 06:01, 13:15, 17:05,
    // 20:18 and 21:51 local — the times Diyanet prints for this date.
    const settings: PrayerSettings = { method: 'Turkey', madhab: 'shafi' };

    expect(times(getDayTimetable(ISTANBUL, settings, AUG_9_2026))).toEqual({
      fajr: '2026-08-09T01:20:00.000Z',
      sunrise: '2026-08-09T03:01:00.000Z',
      dhuhr: '2026-08-09T10:15:00.000Z',
      asr: '2026-08-09T14:05:00.000Z',
      maghrib: '2026-08-09T17:18:00.000Z',
      isha: '2026-08-09T18:51:00.000Z',
    });
  });

  it('reproduces the Umm al-Qura rule that Isha is 90 minutes after Maghrib', () => {
    const settings: PrayerSettings = { method: 'UmmAlQura', madhab: 'shafi' };
    const { entries } = getDayTimetable(MAKKAH, settings, AUG_9_2026);

    const maghrib = entries.find((entry) => entry.slot === 'maghrib')!.time;
    const isha = entries.find((entry) => entry.slot === 'isha')!.time;

    expect((isha.getTime() - maghrib.getTime()) / 60_000).toBe(90);
  });

  it('returns all six times in chronological order', () => {
    const settings: PrayerSettings = { method: 'MuslimWorldLeague', madhab: 'shafi' };
    const { entries } = getDayTimetable(ISTANBUL, settings, AUG_9_2026);

    expect(entries.map((entry) => entry.slot)).toEqual([...PRAYER_SLOTS]);

    const stamps = entries.map((entry) => entry.time.getTime());
    expect([...stamps].sort((a, b) => a - b)).toEqual(stamps);
  });

  it('marks sunrise as the only entry that is not a prayer', () => {
    const settings: PrayerSettings = { method: 'MuslimWorldLeague', madhab: 'shafi' };
    const { entries } = getDayTimetable(ISTANBUL, settings, AUG_9_2026);

    expect(entries.filter((entry) => !entry.isPrayer).map((entry) => entry.slot)).toEqual([
      'sunrise',
    ]);
    expect(NOTIFIABLE_SLOTS).not.toContain('sunrise');
  });

  it('places the Hanafi Asr later than the Shafi one', () => {
    const shafi = getDayTimetable(ISTANBUL, { method: 'Turkey', madhab: 'shafi' }, AUG_9_2026);
    const hanafi = getDayTimetable(ISTANBUL, { method: 'Turkey', madhab: 'hanafi' }, AUG_9_2026);

    const asrOf = (timetable: DayTimetable) =>
      timetable.entries.find((entry) => entry.slot === 'asr')!.time.getTime();

    expect(asrOf(hanafi)).toBeGreaterThan(asrOf(shafi));
  });

  it('still produces valid times inside the Arctic circle in midsummer', () => {
    // Above ~66° the sun never reaches the twilight angle that defines Fajr and
    // Isha, which is what the high-latitude and polar-circle rules exist for.
    const settings: PrayerSettings = { method: 'MuslimWorldLeague', madhab: 'shafi' };
    const { entries } = getDayTimetable(
      TROMSO,
      settings,
      new Date(Date.UTC(2026, 5, 21, 12, 0, 0)),
    );

    for (const entry of entries) {
      expect(Number.isNaN(entry.time.getTime())).toBe(false);
    }
  });
});

describe('selectNextPrayer', () => {
  const settings: PrayerSettings = { method: 'Turkey', madhab: 'shafi' };
  const timetable = getDayTimetable(ISTANBUL, settings, AUG_9_2026);
  const tomorrowFajr = getTomorrowFajr(ISTANBUL, settings, AUG_9_2026);

  it('counts down to the next prayer still ahead', () => {
    // 09:00Z is between Sunrise (03:01Z) and Dhuhr (10:15Z).
    const now = new Date(Date.UTC(2026, 7, 9, 9, 0, 0));
    const next = selectNextPrayer(timetable, tomorrowFajr, now);

    expect(next.slot).toBe('dhuhr');
    expect(next.isTomorrow).toBe(false);
    expect(next.msRemaining).toBe(75 * 60 * 1000);
  });

  it('skips sunrise, which begins no prayer', () => {
    // 02:00Z is after Fajr and before Sunrise; the next prayer is Dhuhr.
    const now = new Date(Date.UTC(2026, 7, 9, 2, 0, 0));
    expect(selectNextPrayer(timetable, tomorrowFajr, now).slot).toBe('dhuhr');
  });

  it("rolls over to tomorrow's Fajr after Isha", () => {
    const now = new Date(Date.UTC(2026, 7, 9, 20, 0, 0));
    const next = selectNextPrayer(timetable, tomorrowFajr, now);

    expect(next.slot).toBe('fajr');
    expect(next.isTomorrow).toBe(true);
    expect(next.time.toISOString()).toBe(tomorrowFajr.toISOString());
    expect(next.msRemaining).toBeGreaterThan(0);
  });

  it('never reports a negative countdown', () => {
    const past = new Date(Date.UTC(2027, 0, 1, 0, 0, 0));
    expect(selectNextPrayer(timetable, tomorrowFajr, past).msRemaining).toBe(0);
  });
});

describe('selectCurrentPrayer', () => {
  const settings: PrayerSettings = { method: 'Turkey', madhab: 'shafi' };
  const timetable = getDayTimetable(ISTANBUL, settings, AUG_9_2026);

  it('reports the period in force', () => {
    expect(selectCurrentPrayer(timetable, new Date(Date.UTC(2026, 7, 9, 11, 0, 0)))).toBe('dhuhr');
    expect(selectCurrentPrayer(timetable, new Date(Date.UTC(2026, 7, 9, 18, 0, 0)))).toBe('maghrib');
    expect(selectCurrentPrayer(timetable, new Date(Date.UTC(2026, 7, 9, 23, 0, 0)))).toBe('isha');
  });

  it("is undefined before Fajr, when the period belongs to the previous day", () => {
    expect(selectCurrentPrayer(timetable, new Date(Date.UTC(2026, 7, 9, 0, 30, 0)))).toBeUndefined();
  });
});

describe('getUpcomingPrayers', () => {
  const settings: PrayerSettings = { method: 'Turkey', madhab: 'shafi' };

  it('lists five prayers a day, in order, excluding sunrise', () => {
    const from = new Date(Date.UTC(2026, 7, 9, 0, 0, 0));
    const upcoming = getUpcomingPrayers(ISTANBUL, settings, from, 3);

    expect(upcoming).toHaveLength(15);
    expect(upcoming.every((prayer) => prayer.slot !== 'sunrise')).toBe(true);

    const stamps = upcoming.map((prayer) => prayer.time.getTime());
    expect([...stamps].sort((a, b) => a - b)).toEqual(stamps);
  });

  it('excludes prayers that have already passed', () => {
    const from = new Date(Date.UTC(2026, 7, 9, 12, 0, 0));
    const upcoming = getUpcomingPrayers(ISTANBUL, settings, from, 1);

    // Only Asr, Maghrib and Isha remain after midday UTC in Istanbul.
    expect(upcoming.map((prayer) => prayer.slot)).toEqual(['asr', 'maghrib', 'isha']);
  });
});

describe('defaultMethodForRegion', () => {
  it('uses each country’s own authority', () => {
    expect(defaultMethodForRegion('TR')).toBe('Turkey');
    expect(defaultMethodForRegion('US')).toBe('NorthAmerica');
    expect(defaultMethodForRegion('SA')).toBe('UmmAlQura');
    expect(defaultMethodForRegion('EG')).toBe('Egyptian');
    expect(defaultMethodForRegion('PK')).toBe('Karachi');
  });

  it('is case insensitive', () => {
    expect(defaultMethodForRegion('tr')).toBe('Turkey');
  });

  it('falls back to the Muslim World League', () => {
    expect(defaultMethodForRegion('JP')).toBe('MuslimWorldLeague');
    expect(defaultMethodForRegion(undefined)).toBe('MuslimWorldLeague');
  });
});
