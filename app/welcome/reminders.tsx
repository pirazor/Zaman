import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { Button } from '../../src/components/Button';
import { Screen } from '../../src/components/Screen';
import { Text } from '../../src/components/Text';
import { canScheduleExactAlarms } from '../../src/lib/exactAlarms';
import { requestNotificationPermission } from '../../src/lib/notifications';
import { useApp } from '../../src/state/AppProvider';
import { spacing } from '../../src/theme';

/**
 * Final step: reminders. Finishing here — by either route — is what marks the
 * app as set up, so this screen is never shown again. The one exception is an
 * Android phone that withholds exact alarms, which gets one more step first.
 */
export default function AllowReminders() {
  const { t, colors, completeOnboarding, setNotificationsEnabled } = useApp();
  const router = useRouter();
  const [requesting, setRequesting] = useState(false);

  // Marking the app as set up retires the welcome branch of the root
  // navigator, which moves to the tabs on its own — see app/_layout.tsx.
  const finish = () => completeOnboarding();

  // A neutral Continue that always presents the system dialog — the same
  // 5.1.1(iv) shape as the location step. The dialog is where the user
  // decides; a refusal is honoured by leaving reminders off.
  const enable = async () => {
    setRequesting(true);
    const permission = await requestNotificationPermission();
    setRequesting(false);

    setNotificationsEnabled(permission === 'granted');

    // Reminders were just allowed, but Android 14 and later can still deliver
    // them late; the next step asks for exact alarms. Always true elsewhere.
    if (permission === 'granted' && !canScheduleExactAlarms()) {
      router.push('/welcome/alarms');
      return;
    }
    finish();
  };

  return (
    <Screen contentStyle={styles.screen}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="bell-ring-outline"
          size={72}
          color={colors.primary}
          style={styles.icon}
        />
        <Text variant="title" weight="700" align="center">
          {t('onboarding_notificationTitle')}
        </Text>
        <Text variant="body" color={colors.textMuted} align="center" style={styles.body}>
          {t('onboarding_notificationBody')}
        </Text>
      </View>

      <View style={styles.footer}>
        <Button label={t('onboarding_continue')} onPress={enable} loading={requesting} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: spacing.xxl,
  },
  header: {
    gap: spacing.md,
  },
  icon: {
    alignSelf: 'center',
  },
  body: {
    lineHeight: 28,
  },
  footer: {
    gap: spacing.sm,
  },
});
