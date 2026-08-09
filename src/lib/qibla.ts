/**
 * Qibla direction.
 *
 * The bearing comes from `adhan`, which solves the great-circle course to the
 * Kaaba rather than the naive flat-map angle — the two disagree by tens of
 * degrees at long range, so the distinction matters everywhere outside Arabia.
 *
 * Pure module — no React or React Native imports — so it is unit testable.
 */

import { Coordinates, Qibla } from 'adhan';
import type { Position } from './prayer';

/** Coordinates of the Kaaba, Masjid al-Haram, Makkah. */
export const KAABA: Position = { latitude: 21.4224779, longitude: 39.8251832 };

/** Within this many degrees of the Qibla, the compass reads as aligned. */
export const ALIGNMENT_TOLERANCE_DEGREES = 4;

const EARTH_RADIUS_KM = 6371;

/** Compass bearing to the Kaaba, in degrees clockwise from true north. */
export function qiblaBearing(position: Position): number {
  return normalizeDegrees(Qibla(new Coordinates(position.latitude, position.longitude)));
}

/** Great-circle distance to the Kaaba in kilometres. */
export function distanceToKaabaKm(position: Position): number {
  const dLat = toRadians(KAABA.latitude - position.latitude);
  const dLon = toRadians(KAABA.longitude - position.longitude);
  const lat1 = toRadians(position.latitude);
  const lat2 = toRadians(KAABA.latitude);

  const a =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

/**
 * How far the user must turn to face the Qibla, in degrees.
 * Positive means turn clockwise (right), negative anticlockwise (left).
 * Always in (-180, 180], so the app never tells anyone to turn the long way.
 */
export function turnAngle(heading: number, bearing: number): number {
  const delta = normalizeDegrees(bearing - heading);
  return delta > 180 ? delta - 360 : delta;
}

export function isAligned(
  heading: number,
  bearing: number,
  tolerance = ALIGNMENT_TOLERANCE_DEGREES,
): boolean {
  return Math.abs(turnAngle(heading, bearing)) <= tolerance;
}

/** Wraps any angle into [0, 360). */
export function normalizeDegrees(degrees: number): number {
  return ((degrees % 360) + 360) % 360;
}

/**
 * Unwraps a target angle so that animating from `current` to it takes the
 * short way round: rotating from 350° to 10° should sweep +20°, not -340°.
 * Returns a value that may fall outside [0, 360).
 */
export function shortestRotation(current: number, target: number): number {
  const delta = normalizeDegrees(target - normalizeDegrees(current));
  return current + (delta > 180 ? delta - 360 : delta);
}

/**
 * Low-pass filter for the compass stream. Raw magnetometer headings jitter by
 * several degrees; without smoothing the needle is unreadable.
 * `factor` is the weight given to the new reading (0 = frozen, 1 = raw).
 */
export function smoothHeading(previous: number, next: number, factor = 0.18): number {
  const unwrapped = shortestRotation(previous, next);
  return normalizeDegrees(previous + (unwrapped - previous) * factor);
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
