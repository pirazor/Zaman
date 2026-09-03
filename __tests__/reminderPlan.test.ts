import {
  DEFAULT_REMINDER_MINUTES,
  MAX_SCHEDULED,
  planReminders,
  REMINDER_MINUTE_OPTIONS,
} from '../src/lib/reminderPlan';
import { getUpcomingPrayers, type PrayerSettings } from '../src/lib/prayer';

const ISTANBUL = { latitude: 41.0082, longitude: 28.9784 };
const SETTINGS: PrayerSettings = { method: 'Turkey' };

const at = (hours: number, minutes = 0) =>
  new Date(Date.UTC(2026, 7, 9, hours, minutes, 0));

describe('planReminders', () => {
  const prayers = [
    { slot: 'fajr' as const, time: at(4) },
    { slot: 'dhuhr' as const, time: at(12) },
    { slot: 'asr' as const, time: at(16) },
  ];

  it('fires the reminder the configured number of minutes early', () => {
    const plan = planReminders(prayers, 15, at(0));

    expect(plan).toHaveLength(3);
    expect(plan[0].slot).toBe('fajr');
    expect(plan[0].prayerTime.toISOString()).toBe(at(4).toISOString());
    expect(plan[0].fireAt.toISOString()).toBe(at(3, 45).toISOString());
  });

  it('skips a prayer whose reminder window has already closed', () => {
    // 11:50 is inside Dhuhr's 15-minute window, so a "15 minutes before"
    // notice can no longer be truthful and is dropped.
    const plan = planReminders(prayers, 15, at(11, 50));

    expect(plan.map((reminder) => reminder.slot)).toEqual(['asr']);
  });

  it('drops a reminder exactly on its fire time rather than firing late', () => {
    const plan = planReminders(prayers, 15, at(3, 45));
    expect(plan.map((reminder) => reminder.slot)).toEqual(['dhuhr', 'asr']);
  });

  it('honours the reminder interval the user chose', () => {
    for (const minutes of REMINDER_MINUTE_OPTIONS) {
      const [first] = planReminders(prayers, minutes, at(0));
      expect(first.prayerTime.getTime() - first.fireAt.getTime()).toBe(minutes * 60 * 1000);
    }
  });

  it('defaults to fifteen minutes, and that is an offered option', () => {
    expect(DEFAULT_REMINDER_MINUTES).toBe(15);
    expect(REMINDER_MINUTE_OPTIONS).toContain(DEFAULT_REMINDER_MINUTES);
  });

  it('returns nothing when every prayer is in the past', () => {
    expect(planReminders(prayers, 15, at(23))).toEqual([]);
    expect(planReminders([], 15, at(0))).toEqual([]);
  });

  it('stays within the queue iOS will accept', () => {
    // Two weeks of five daily prayers is far more than the OS will hold, so
    // the plan must be truncated rather than silently dropped by the system.
    const fortnight = getUpcomingPrayers(ISTANBUL, SETTINGS, at(0), 14);
    expect(fortnight.length).toBeGreaterThan(MAX_SCHEDULED);

    const plan = planReminders(fortnight, 15, at(0));

    expect(plan).toHaveLength(MAX_SCHEDULED);
    expect(MAX_SCHEDULED).toBeLessThan(64);
  });

  it('queues the soonest reminders first, in order', () => {
    const fortnight = getUpcomingPrayers(ISTANBUL, SETTINGS, at(0), 14);
    const plan = planReminders(fortnight, 15, at(0));

    const stamps = plan.map((reminder) => reminder.fireAt.getTime());
    expect([...stamps].sort((a, b) => a - b)).toEqual(stamps);
    expect(stamps[0]).toBeGreaterThan(at(0).getTime());
  });

  it('covers more than a week ahead, so reminders survive a gap in use', () => {
    const fortnight = getUpcomingPrayers(ISTANBUL, SETTINGS, at(0), 14);
    const plan = planReminders(fortnight, 15, at(0));

    const lastFireAt = plan[plan.length - 1].fireAt.getTime();
    const daysCovered = (lastFireAt - at(0).getTime()) / (24 * 60 * 60 * 1000);
    expect(daysCovered).toBeGreaterThan(7);
  });
});
