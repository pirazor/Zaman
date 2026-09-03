import { cityById } from '../src/lib/cities';
import { nextPrayerForCity } from '../src/lib/secondCity';
import { describeRemainingShort } from '../src/i18n';
import { splitRemaining } from '../src/lib/duration';
import { DEFAULT_STATE } from '../src/lib/storage';

describe('nextPrayerForCity', () => {
  // Monday 10 Aug 2026, 19:20 UTC: 15:20 in New York, 22:20 in İstanbul —
  // after İstanbul's Isha, so its next prayer is tomorrow's Fajr.
  const now = new Date(Date.UTC(2026, 7, 10, 19, 20, 0));

  it("rolls to tomorrow's Fajr after the city's Isha", () => {
    const istanbul = cityById('istanbul')!;
    const next = nextPrayerForCity(istanbul, 'shafi', now);

    expect(next.slot).toBe('fajr');
    expect(next.isTomorrow).toBe(true);
    // İstanbul Fajr on 11 Aug 2026 is 04:23 local = 01:23 UTC.
    expect(next.time.toISOString()).toBe('2026-08-11T01:23:00.000Z');
  });

  it("uses the city's own calendar day, not the phone's", () => {
    // 23:00 UTC on the 10th is 02:00 on the 11th in İstanbul — before that
    // day's Fajr. Computed on the city's day, the next prayer is *today's*
    // Fajr (isTomorrow false); computed on the device's day it would roll
    // over and claim tomorrow. Same instant either way, different meaning.
    const beforeFajr = new Date(Date.UTC(2026, 7, 10, 23, 0, 0));
    const next = nextPrayerForCity(cityById('istanbul')!, 'shafi', beforeFajr);

    expect(next.slot).toBe('fajr');
    expect(next.isTomorrow).toBe(false);
    expect(next.time.toISOString()).toBe('2026-08-11T01:23:00.000Z');
  });

  it("applies the city's own calculation method", () => {
    // Makkah must come out on Umm al-Qura's fixed 90-minute Isha.
    const makkah = cityById('makkah')!;
    const midday = new Date(Date.UTC(2026, 7, 10, 12, 0, 0));
    const maghrib = nextPrayerForCity(makkah, 'shafi', new Date(Date.UTC(2026, 7, 10, 15, 0)));
    const isha = nextPrayerForCity(makkah, 'shafi', new Date(maghrib.time.getTime() + 60_000));

    expect(maghrib.slot).toBe('maghrib');
    expect(isha.slot).toBe('isha');
    expect((isha.time.getTime() - maghrib.time.getTime()) / 60_000).toBe(90);
    expect(midday.getTime()).toBeLessThan(maghrib.time.getTime());
  });

  it("keeps a Turkish city on Diyanet's İkindi for a Hanafi user", () => {
    // 2 Sep 2026 at 16:00 İstanbul (13:00 UTC). Diyanet published İkindi
    // 16:48; the Hanafi shadow rule would say 17:45, which no mosque there uses.
    const afternoon = new Date(Date.UTC(2026, 8, 2, 13, 0, 0));
    const next = nextPrayerForCity(cityById('istanbul')!, 'hanafi', afternoon);

    expect(next.slot).toBe('asr');
    expect(Math.abs(next.time.getTime() - Date.UTC(2026, 8, 2, 13, 48))).toBeLessThanOrEqual(60_000);
  });

  it('keeps the countdown positive and under a day', () => {
    const cities = ['istanbul', 'new-york', 'tokyo', 'auckland', 'los-angeles'] as const;
    for (const id of cities) {
      const next = nextPrayerForCity(cityById(id)!, 'shafi', now);
      expect(next.msRemaining).toBeGreaterThan(0);
      expect(next.msRemaining).toBeLessThan(24 * 3600e3);
    }
  });
});

describe('describeRemainingShort', () => {
  const sixHours = splitRemaining(6 * 3600e3 + 3 * 60e3);

  it('compacts the units per language', () => {
    expect(describeRemainingShort('en', sixHours)).toBe('6 h 3 m');
    expect(describeRemainingShort('tr', sixHours)).toBe('6 sa 3 dk');
    expect(describeRemainingShort('ar', sixHours)).toBe('6 س 3 د');
  });

  it('says "now" at zero like the long form', () => {
    expect(describeRemainingShort('en', [])).toBe('Now');
  });
});

describe('second city defaults', () => {
  it('ships disabled', () => {
    expect(DEFAULT_STATE.secondCityEnabled).toBe(false);
    expect(DEFAULT_STATE.secondCityId).toBeUndefined();
  });
});
