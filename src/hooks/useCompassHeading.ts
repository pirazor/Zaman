import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';

import { smoothHeading } from '../lib/qibla';

export interface CompassReading {
  /** Degrees clockwise from north, or `undefined` before the first reading. */
  heading: number | undefined;
  /** 0 (unusable) to 3 (high). Below 2 the user is asked to calibrate. */
  accuracy: number;
  /** False when the device has no magnetometer, or it cannot be read. */
  available: boolean;
  /** True until availability has been determined. */
  checking: boolean;
}

/**
 * Streams the device's compass heading.
 *
 * `expo-location`'s heading stream is used rather than the raw magnetometer
 * because it reports *true* north: it applies the local magnetic declination,
 * which reaches double-digit degrees in parts of the world and would otherwise
 * put the Qibla noticeably off. Readings are low-pass filtered, since raw
 * values jitter by several degrees and an unfiltered needle is unreadable.
 *
 * The subscription is dropped while the app is backgrounded.
 */
export function useCompassHeading(): CompassReading {
  const [heading, setHeading] = useState<number | undefined>(undefined);
  const [accuracy, setAccuracy] = useState(0);
  const [available, setAvailable] = useState(false);
  const [checking, setChecking] = useState(true);

  // Smoothing needs the previous value without re-subscribing on every reading.
  const smoothed = useRef<number | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    let subscription: Location.LocationSubscription | undefined;

    const subscribe = async () => {
      if (subscription) return;
      try {
        const hasMagnetometer = await Magnetometer.isAvailableAsync();
        if (cancelled) return;

        setAvailable(hasMagnetometer);
        setChecking(false);
        if (!hasMagnetometer) return;

        subscription = await Location.watchHeadingAsync((reading) => {
          // `trueHeading` is -1 until location permission is granted; the
          // magnetic heading is still useful, just uncorrected.
          const raw = reading.trueHeading >= 0 ? reading.trueHeading : reading.magHeading;
          if (!Number.isFinite(raw) || raw < 0) return;

          const next =
            smoothed.current === undefined ? raw : smoothHeading(smoothed.current, raw);
          smoothed.current = next;

          setHeading(next);
          setAccuracy(reading.accuracy);
        });

        if (cancelled) {
          subscription.remove();
          subscription = undefined;
        }
      } catch {
        if (cancelled) return;
        setAvailable(false);
        setChecking(false);
      }
    };

    const unsubscribe = () => {
      subscription?.remove();
      subscription = undefined;
      smoothed.current = undefined;
    };

    if (AppState.currentState === 'active') void subscribe();

    const appStateSubscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') void subscribe();
      else unsubscribe();
    });

    return () => {
      cancelled = true;
      unsubscribe();
      appStateSubscription.remove();
    };
  }, []);

  return { heading, accuracy, available, checking };
}
