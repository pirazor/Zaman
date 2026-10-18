/**
 * "Alarms & reminders" access on Android.
 *
 * Reminders are only scheduled to the minute while the app holds this access;
 * without it Android may hold them back by up to an hour. Android 14 and later
 * switch it off for new installs, so the user has to turn it on once.
 *
 * The native half lives in `modules/exact-alarms` and exists on Android only.
 * Everywhere else — iOS, the web, and Android builds made before the module —
 * the access is reported as held, so no prompt is ever shown there.
 */

import { Platform } from 'react-native';
import { requireOptionalNativeModule } from 'expo';

interface ExactAlarmsModule {
  canScheduleExactAlarms(): boolean;
  openExactAlarmSettings(): boolean;
}

const native =
  Platform.OS === 'android' ? requireOptionalNativeModule<ExactAlarmsModule>('ExactAlarms') : null;

export function canScheduleExactAlarms(): boolean {
  try {
    return native?.canScheduleExactAlarms() ?? true;
  } catch {
    return true;
  }
}

/** Opens the system page where the access is granted. False if none opened. */
export function openExactAlarmSettings(): boolean {
  try {
    return native?.openExactAlarmSettings() ?? false;
  } catch {
    return false;
  }
}
