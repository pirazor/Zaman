/**
 * Location capture.
 *
 * The app asks for "when in use" precision once, then caches the fix. Prayer
 * times shift by under a minute across a whole city, so there is no reason to
 * track the user continuously — a fix per launch, refreshable by hand, is both
 * more accurate than needed and far kinder to the battery.
 */

import * as Location from 'expo-location';
import type { Position } from './prayer';
import type { CachedPlace } from './storage';

export type LocationStatus =
  | 'idle'
  | 'requesting'
  | 'granted'
  | 'denied'
  /** Denied and the OS will not ask again; only Settings can undo it. */
  | 'blocked'
  /** Location services are switched off device-wide. */
  | 'unavailable';

export interface LocationResult {
  status: LocationStatus;
  place?: CachedPlace;
}

/**
 * Requests permission if needed and returns a fix. Falls back to the last
 * known position when a fresh fix is slow — indoors this is the difference
 * between instant times and a blank screen.
 */
export async function captureLocation(): Promise<LocationResult> {
  let permission = await Location.getForegroundPermissionsAsync();

  if (permission.status !== 'granted') {
    if (!permission.canAskAgain) return { status: 'blocked' };
    permission = await Location.requestForegroundPermissionsAsync();
  }

  if (permission.status !== 'granted') {
    return { status: permission.canAskAgain ? 'denied' : 'blocked' };
  }

  const enabled = await Location.hasServicesEnabledAsync();
  if (!enabled) return { status: 'unavailable' };

  try {
    const lastKnown = await Location.getLastKnownPositionAsync({ maxAge: 60 * 60 * 1000 });

    const fresh = await Location.getCurrentPositionAsync({
      // City-level precision is all prayer times need, and it resolves far
      // faster and with less battery than a high-accuracy GPS lock.
      accuracy: Location.Accuracy.Balanced,
    }).catch(() => null);

    const position = fresh ?? lastKnown;
    if (!position) return { status: 'unavailable' };

    const place: CachedPlace = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      capturedAt: Date.now(),
    };

    return { status: 'granted', place: await describe(place) };
  } catch {
    return { status: 'unavailable' };
  }
}

/**
 * Adds a city name and country to a fix. Reverse geocoding is a nicety — it
 * needs a network on some platforms — so failure is silently ignored.
 */
async function describe(place: CachedPlace): Promise<CachedPlace> {
  try {
    const [address] = await Location.reverseGeocodeAsync({
      latitude: place.latitude,
      longitude: place.longitude,
    });
    if (!address) return place;

    const label = address.city ?? address.subregion ?? address.region ?? address.country;

    return {
      ...place,
      label: label ?? undefined,
      region: address.isoCountryCode ?? undefined,
    };
  } catch {
    return place;
  }
}

/** Whether a cached fix is recent enough to reuse without asking the OS again. */
export function isFresh(place: CachedPlace | undefined, maxAgeMs = 6 * 60 * 60 * 1000): boolean {
  return !!place && Date.now() - place.capturedAt < maxAgeMs;
}

export function toPosition(place: CachedPlace): Position {
  return { latitude: place.latitude, longitude: place.longitude };
}
