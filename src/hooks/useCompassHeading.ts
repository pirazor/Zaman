import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';

import { smoothHeading } from '../lib/qibla';

/** How long to wait before retrying a heading stream that failed to open. */
const RETRY_DELAY_MS = 400;

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
 * The subscription is dropped while the app is backgrounded and reopened on
 * return. Reopening is the fragile moment — the sensor is often not ready for
 * a few hundred milliseconds — so failures there are retried rather than
 * reported, and `available` describes the hardware, never the stream.
 */
export function useCompassHeading(): CompassReading {
  const [heading, setHeading] = useState<number | undefined>(undefined);
  const [accuracy, setAccuracy] = useState(0);
  const [available, setAvailable] = useState(false);
  const [checking, setChecking] = useState(true);

  // Smoothing needs the previous value without re-subscribing on every reading.
  const smoothed = useRef<number | undefined>(undefined);

  useEffect(() => {
    let disposed = false;
    let subscription: Location.LocationSubscription | undefined;
    /** Guards against two overlapping starts while the first is awaiting. */
    let starting = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    /**
     * Whether this device has a magnetometer at all, asked once and kept.
     *
     * Hardware does not come and go, but the check itself can fail while the
     * app is resuming — and answering "this phone has no compass" to a
     * momentary failure is both wrong and unrecoverable, since by then
     * nothing would ever ask again.
     */
    let hasHardware: boolean | undefined;

    const clearRetry = () => {
      if (retryTimer === undefined) return;
      clearTimeout(retryTimer);
      retryTimer = undefined;
    };

    const start = async () => {
      if (disposed || subscription || starting) return;
      starting = true;
      clearRetry();

      try {
        if (hasHardware === undefined) {
          hasHardware = await Magnetometer.isAvailableAsync();
          if (disposed) return;
          setAvailable(hasHardware);
          setChecking(false);
        }
        if (!hasHardware) return;

        const next = await Location.watchHeadingAsync((reading) => {
          // `trueHeading` is -1 until location permission is granted; the
          // magnetic heading is still useful, just uncorrected.
          const raw = reading.trueHeading >= 0 ? reading.trueHeading : reading.magHeading;
          if (!Number.isFinite(raw) || raw < 0) return;

          const smoothedNext =
            smoothed.current === undefined ? raw : smoothHeading(smoothed.current, raw);
          smoothed.current = smoothedNext;

          setHeading(smoothedNext);
          setAccuracy(reading.accuracy);
        });

        // The screen may have been left while the subscription was opening.
        if (disposed || AppState.currentState !== 'active') {
          next.remove();
          return;
        }
        subscription = next;
      } catch {
        // Sensors are routinely unready for a moment after the app returns to
        // the foreground. Retry instead of reporting missing hardware.
        if (!disposed) retryTimer = setTimeout(() => void start(), RETRY_DELAY_MS);
      } finally {
        starting = false;
      }
    };

    const stop = () => {
      clearRetry();
      subscription?.remove();
      subscription = undefined;
      // Drop the filter so the needle starts from the live heading rather
      // than sweeping across from wherever the phone was pointing before.
      smoothed.current = undefined;
    };

    if (AppState.currentState === 'active') void start();

    const appStateSubscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') void start();
      else stop();
    });

    return () => {
      disposed = true;
      stop();
      appStateSubscription.remove();
    };
  }, []);

  return { heading, accuracy, available, checking };
}
