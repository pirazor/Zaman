package expo.modules.exactalarms

import android.app.AlarmManager
import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

/**
 * Exact alarms on Android 12 and later.
 *
 * expo-notifications schedules reminders as exact alarms only when the app
 * holds "Alarms & reminders" access; otherwise Android may deliver them up to
 * an hour late. Since Android 14 that access is off for new installs, and
 * nothing in Expo reports it or leads the user to it, hence this module.
 */
class ExactAlarmsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExactAlarms")

    Function<Boolean>("canScheduleExactAlarms") {
      val context = appContext.reactContext ?: return@Function true
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) return@Function true

      val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as? AlarmManager
        ?: return@Function true
      alarmManager.canScheduleExactAlarms()
    }

    Function<Boolean>("openExactAlarmSettings") {
      val context = appContext.reactContext ?: return@Function false
      val packageUri = Uri.parse("package:${context.packageName}")

      // The app's own "Alarms & reminders" page where the system has one;
      // the app's info page, which links to it, where it does not.
      val intents = buildList {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
          add(Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM, packageUri))
        }
        add(Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, packageUri))
      }

      val activity = appContext.currentActivity
      for (intent in intents) {
        try {
          if (activity != null) {
            activity.startActivity(intent)
          } else {
            context.startActivity(intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
          }
          return@Function true
        } catch (e: ActivityNotFoundException) {
          // Try the next, more general page.
        }
      }
      false
    }
  }
}
