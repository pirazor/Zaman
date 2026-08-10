import { useEffect, useRef, useState } from 'react';
import { useIsFocused } from 'expo-router';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';

import { smoothHeading } from '../lib/qibla';

/** How long to wait before retrying a heading stream that failed to open. */
const RETRY_DELAY_MS = 400;

/**
 * A healthy heading stream reports several times a second — sensor jitter
 * alone guarantees updates even on a phone lying still. Silence this long
 * means the stream is dead, not that the phone is steady.
 */
const STALL_TIMEOUT_MS = 4000;

/** How often the watchdog looks at the stream's last-delivery time. */
const WATCHDOG_INTERVAL_MS = 2000;

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
 * Streams the device's compass heading while the Qibla screen is on show.
 *
 * `expo-location`'s heading stream is used rather than the raw magnetometer
 * because it reports *true* north: it applies the local magnetic declination,
 * which reaches double-digit degrees in parts of the world and would otherwise
 * put the Qibla noticeably off. Readings are low-pass filtered, since raw
 * values jitter by several degrees and an unfiltered needle is unreadable.
 *
 * The subscription's lifetime is tied to *navigation focus*, deliberately not
 * to app state. Tearing the stream down when the app was backgrounded and
 * rebuilding it on return proved unreliable — the rebuilt stream frequently
 * never delivered another reading, leaving the dial frozen. iOS already stops
 * delivering headings to a suspended app and resumes on its own, so the
 * subscription is simply left in place across that transition. Leaving the
 * screen still releases it, which is what actually matters for the sensor.
 */
export function useCompassHeading(): CompassReading {
  const isFocused = useIsFocused();

  const [heading, setHeading] = useState<number | undefined>(undefined);
  const [accuracy, setAccuracy] = useState(0);
  const [available, setAvailable] = useState(false);
  const [checking, setChecking] = useState(true);

  // Smoothing needs the previous value without re-subscribing on every reading.
  const smoothed = useRef<number | undefined>(undefined);

  /**
   * Whether this device has a magnetometer at all, asked once and kept across
   * focus changes. Hardware does not come and go, whereas the check itself can
   * fail transiently — and answering "this phone has no compass" to a
   * momentary failure is both wrong and unrecoverable.
   */
  const hasHardware = useRef<boolean | undefined>(undefined);

  useEffect(() => {
    if (!isFocused) return;

    let disposed = false;
    let subscription: Location.LocationSubscription | undefined;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let watchdog: ReturnType<typeof setInterval> | undefined;
    let lastDelivery = 0;

    /**
     * Touches the native location module before the heading watch opens.
     *
     * On a fresh install the onboarding flow has already requested permission
     * and taken a GPS fix, and the compass works. On a relaunch with a cached
     * location all of that is skipped, making the heading watch the first
     * call into the module in the process — and a watch opened against the
     * cold module can come up silent. Asking for the permission state and the
     * last known position (both cheap, neither prompts nor spins up GPS)
     * walks the same initialization path the working case walks.
     */
    const warmUp = async () => {
      try {
        const permission = await Location.getForegroundPermissionsAsync();
        if (permission.granted) {
          await Location.getLastKnownPositionAsync({});
        }
      } catch {
        // Warming is best-effort; the watchdog below covers a cold start
        // that still comes up silent.
      }
    };

    const close = () => {
      subscription?.remove();
      subscription = undefined;
    };

    const open = async () => {
      try {
        if (hasHardware.current === undefined) {
          hasHardware.current = await Magnetometer.isAvailableAsync();
          if (disposed) return;
          setAvailable(hasHardware.current);
          setChecking(false);
        }
        if (!hasHardware.current) return;

        await warmUp();
        if (disposed) return;

        const next = await Location.watchHeadingAsync((reading) => {
          lastDelivery = Date.now();

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

        // The screen may have been left while the stream was opening.
        if (disposed) {
          next.remove();
          return;
        }
        subscription = next;
        lastDelivery = Date.now();
      } catch {
        // Sensors can be unready for a moment. Retry rather than concluding
        // anything about the hardware.
        if (!disposed) retryTimer = setTimeout(() => void open(), RETRY_DELAY_MS);
      }
    };

    void open();

    // A stream can open successfully and still never deliver. Nothing in the
    // API reports that, so the only defence is to notice the silence and
    // rebuild the subscription.
    watchdog = setInterval(() => {
      if (disposed || !subscription) return;
      if (Date.now() - lastDelivery < STALL_TIMEOUT_MS) return;
      close();
      void open();
    }, WATCHDOG_INTERVAL_MS);

    return () => {
      disposed = true;
      if (retryTimer !== undefined) clearTimeout(retryTimer);
      if (watchdog !== undefined) clearInterval(watchdog);
      close();
      // Drop the filter so the needle starts from the live heading rather
      // than sweeping across from wherever the phone was pointing before.
      smoothed.current = undefined;
    };
  }, [isFocused]);

  return { heading, accuracy, available, checking };
}
