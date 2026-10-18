import React, { useEffect } from 'react';
import { AppState, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { Button } from '../../src/components/Button';
import { Screen } from '../../src/components/Screen';
import { Text } from '../../src/components/Text';
import { canScheduleExactAlarms, openExactAlarmSettings } from '../../src/lib/exactAlarms';
import { useApp } from '../../src/state/AppProvider';
import { spacing } from '../../src/theme';

/**
 * Android-only last step: exact alarms.
 *
 * Shown only when reminders were allowed but Android 14 or later withholds
 * exact alarms, without which a "15 minutes before" reminder can arrive after
 * the adhan. The access lives on a system page rather than in a dialog, so
 * this screen sends the user there and finishes by itself once they return
 * with it switched on.
 */
export default function AllowExactAlarms() {
  const { t, colors, completeOnboarding } = useApp();

  useEffect(() => {
    // Coming back from the system page is the only sign a choice was made.
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active' && canScheduleExactAlarms()) completeOnboarding();
    });
    return () => subscription.remove();
  }, [completeOnboarding]);

  const open = () => {
    // Nowhere to send the user: carry on rather than strand them here.
    if (!openExactAlarmSettings()) completeOnboarding();
  };

  return (
    <Screen contentStyle={styles.screen}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="alarm-check"
          size={72}
          color={colors.primary}
          style={styles.icon}
        />
        <Text variant="title" weight="700" align="center">
          {t('onboarding_alarmsTitle')}
        </Text>
        <Text variant="body" color={colors.textMuted} align="center" style={styles.body}>
          {t('onboarding_alarmsBody')}
        </Text>
      </View>

      <View style={styles.footer}>
        <Button label={t('onboarding_alarmsOpen')} onPress={open} />
        <Button label={t('onboarding_alarmsLater')} variant="quiet" onPress={completeOnboarding} />
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
