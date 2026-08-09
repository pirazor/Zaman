/**
 * Breaking the time until the next prayer into spoken parts.
 *
 * A digital-clock countdown ("1:33:00") is compact but asks the reader to
 * decode a format — and it looks uncomfortably like a time of day, which is
 * exactly the wrong reading on a screen full of prayer times. Naming the units
 * instead ("1 hour 33 minutes") needs no decoding at all.
 *
 * Seconds are shown only in the last minute. Above that they add churn without
 * information: nobody plans around the difference between 33 and 32 minutes,
 * and a number that changes ten times while you read it is harder to read.
 *
 * Pure module — no React or React Native imports — so it is unit testable.
 */

export type DurationUnit = 'hour' | 'minute' | 'second';

export interface DurationSegment {
  value: number;
  unit: DurationUnit;
}

/**
 * Splits a remaining span into the one or two parts worth saying out loud.
 *
 * An empty array means the prayer has arrived, which callers render as "Now"
 * rather than as a row of zeroes.
 */
export function splitRemaining(ms: number): DurationSegment[] {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  if (totalSeconds === 0) return [];

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  // Under a minute the seconds are the only thing left to report, and this is
  // the one moment where watching them tick is genuinely useful.
  if (hours === 0 && minutes === 0) {
    return [{ value: totalSeconds, unit: 'second' }];
  }

  const segments: DurationSegment[] = [];
  if (hours > 0) segments.push({ value: hours, unit: 'hour' });

  // A whole number of hours reads better as "2 hours" than "2 hours 0 minutes".
  if (minutes > 0) segments.push({ value: minutes, unit: 'minute' });

  return segments;
}
