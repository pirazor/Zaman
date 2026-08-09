/**
 * Deciding which reminders to place in the OS notification queue.
 *
 * Split out from `notifications.ts`, which necessarily imports native modules,
 * so the windowing rules stay pure and unit testable.
 */

import type { PrayerSlot } from './prayer';

/**
 * iOS keeps at most 64 pending local notifications per app and silently drops
 * the rest. Staying under that leaves room for the OS's own headroom.
 */
export const MAX_SCHEDULED = 50;

/** How far ahead to compute prayer times when filling the queue. */
export const SCHEDULE_HORIZON_DAYS = 14;

export const REMINDER_MINUTE_OPTIONS = [5, 10, 15, 20, 30] as const;

export const DEFAULT_REMINDER_MINUTES = 15;

export interface PlannedReminder {
  slot: PrayerSlot;
  /** When the prayer itself begins. */
  prayerTime: Date;
  /** When the reminder should fire. */
  fireAt: Date;
}

/**
 * Chooses which reminders to queue.
 *
 * Reminders whose fire time has already passed are skipped even when the
 * prayer itself is still ahead — a "15 minutes before" notice delivered two
 * minutes before the adhan would be worse than none at all.
 */
export function planReminders(
  prayers: readonly { slot: PrayerSlot; time: Date }[],
  reminderMinutes: number,
  now: Date,
  limit = MAX_SCHEDULED,
): PlannedReminder[] {
  const offsetMs = reminderMinutes * 60 * 1000;
  const plan: PlannedReminder[] = [];

  for (const prayer of prayers) {
    if (plan.length >= limit) break;

    const fireAt = new Date(prayer.time.getTime() - offsetMs);
    if (fireAt.getTime() <= now.getTime()) continue;

    plan.push({ slot: prayer.slot, prayerTime: prayer.time, fireAt });
  }

  return plan;
}
