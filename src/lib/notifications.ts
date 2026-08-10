/**
 * Reminders before the adhan.
 *
 * These are local notifications scheduled ahead of time on the device — no
 * push server, no account, and they still fire with the phone offline. Because
 * the OS holds a bounded queue, the app keeps a rolling window of the next
 * `MAX_SCHEDULED` reminders and refreshes it whenever it is opened, the
 * location moves, or the settings change.
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { createTranslator, type Language } from '../i18n';
import type { PrayerSettings, Position } from './prayer';
import { getUpcomingPrayers } from './prayer';
import { planReminders, SCHEDULE_HORIZON_DAYS } from './reminderPlan';
import { formatTime, type TimeFormat } from './time';

export * from './reminderPlan';

export const ANDROID_CHANNEL_ID = 'prayer-reminders';

/** Creates the Android channel. No-op elsewhere. Safe to call repeatedly. */
export async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: 'Prayer reminders',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    sound: 'default',
  });
}

export type NotificationPermission = 'granted' | 'denied' | 'blocked';

export async function getNotificationPermission(): Promise<NotificationPermission> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return 'granted';
  return current.canAskAgain ? 'denied' : 'blocked';
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return 'granted';
  if (!current.canAskAgain) return 'blocked';

  const next = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowSound: true, allowBadge: false },
  });

  if (next.granted) return 'granted';
  return next.canAskAgain ? 'denied' : 'blocked';
}

export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export interface SyncOptions {
  position: Position;
  prayerSettings: PrayerSettings;
  language: Language;
  timeFormat: TimeFormat;
  reminderMinutes: number;
  enabled: boolean;
  now?: Date;
}

/**
 * Rebuilds the reminder queue from scratch. Clearing first is deliberate: it
 * is the only way to guarantee stale reminders from an old location, language
 * or calculation method never fire.
 *
 * Returns the number of reminders now queued.
 */
export async function syncReminders(options: SyncOptions): Promise<number> {
  const now = options.now ?? new Date();

  await cancelAllReminders();

  if (!options.enabled) return 0;
  if ((await getNotificationPermission()) !== 'granted') return 0;

  await ensureAndroidChannel();

  const prayers = getUpcomingPrayers(
    options.position,
    options.prayerSettings,
    now,
    SCHEDULE_HORIZON_DAYS,
  );
  const plan = planReminders(prayers, options.reminderMinutes, now);
  const t = createTranslator(options.language);

  for (const reminder of plan) {
    const prayerName = t(`prayer_${reminder.slot}`);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: t('notification_title', {
          prayer: prayerName,
          minutes: options.reminderMinutes,
        }),
        body: t('notification_body', {
          prayer: prayerName,
          time: formatTime(reminder.prayerTime, options.timeFormat, options.language),
        }),
        sound: 'default',
        data: { slot: reminder.slot, prayerTime: reminder.prayerTime.toISOString() },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: reminder.fireAt,
        channelId: ANDROID_CHANNEL_ID,
      },
    });
  }

  return plan.length;
}
