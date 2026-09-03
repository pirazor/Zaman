/**
 * The optional second city on the home screen.
 *
 * Its state mirrors the hero card's semantics exactly — the next prayer and
 * the time remaining to it, rolling to tomorrow's Fajr after Isha — computed
 * with the city's own authority's method and read on the city's own clock.
 *
 * Pure module — no React or React Native imports — so it is unit testable.
 */

import type { City } from './cities';
import { cityPosition } from './cities';
import {
  getDayTimetable,
  getTomorrowFajr,
  selectNextPrayer,
  type UpcomingPrayer,
} from './prayer';
import { dateInTimeZone } from './time';

/**
 * The next prayer for a city, from that city's own calendar day.
 *
 * The method is the city's own authority's, so İstanbul reads Diyanet even
 * when the user's own timetable is ISNA — and with it that authority's Asr.
 */
export function nextPrayerForCity(city: City, now: Date): UpcomingPrayer {
  const position = cityPosition(city);
  const settings = { method: city.method };
  const cityDay = dateInTimeZone(now, city.timezone);

  return selectNextPrayer(
    getDayTimetable(position, settings, cityDay),
    getTomorrowFajr(position, settings, cityDay),
    now,
  );
}
