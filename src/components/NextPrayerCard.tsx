import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useApp } from '../state/AppProvider';
import type { UpcomingPrayer } from '../lib/prayer';
import { formatCountdown, formatTime } from '../lib/time';
import { fontSize, radius, shadow, spacing } from '../theme';
import { Text } from './Text';

export interface NextPrayerCardProps {
  next: UpcomingPrayer;
  /** Recomputed each second by the caller so the countdown ticks. */
  msRemaining: number;
}

/**
 * The centrepiece of the home screen: which prayer is next, at what time, and
 * how long is left. Deliberately the largest element in the app — for most
 * openings it is the only thing the user came to see.
 */
export function NextPrayerCard({ next, msRemaining }: NextPrayerCardProps) {
  const { colors, t, timeFormat, isRTL } = useApp();

  const name = t(`prayer_${next.slot}`);
  const at = formatTime(next.time, timeFormat);
  const countdown = formatCountdown(msRemaining);

  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDeep]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, shadow.hero]}
    >
      <Text
        variant="label"
        weight="700"
        color={colors.onPrimaryMuted}
        style={styles.eyebrow}
        accessibilityRole="header"
      >
        {t('home_next').toLocaleUpperCase()}
      </Text>

      <View style={[styles.headline, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Text variant="title" weight="700" color={colors.onPrimary} style={styles.name}>
          {name}
        </Text>
        <Text variant="heading" weight="600" tabular color={colors.onPrimary}>
          {at}
        </Text>
      </View>

      {next.isTomorrow ? (
        <Text variant="caption" color={colors.onPrimaryMuted} align={isRTL ? 'right' : 'left'}>
          {t('home_tomorrow')}
        </Text>
      ) : null}

      <View style={[styles.divider, { backgroundColor: colors.onPrimaryMuted }]} />

      <Text
        variant="display"
        weight="700"
        tabular
        color={colors.onPrimary}
        align="center"
        style={styles.countdown}
        // Read as "2 hours 14 minutes" rather than the digit string, and only
        // re-announced when the caller changes it.
        accessibilityLabel={`${t('home_timeLeft')}: ${countdown}`}
      >
        {countdown}
      </Text>

      <Text variant="label" color={colors.onPrimaryMuted} align="center">
        {t('home_timeLeft')}
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  eyebrow: {
    letterSpacing: 1.2,
    fontSize: fontSize.caption,
  },
  headline: {
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  name: {
    flexShrink: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth * 3,
    opacity: 0.35,
    marginVertical: spacing.md,
    borderRadius: radius.pill,
  },
  countdown: {
    lineHeight: fontSize.display * 1.1,
  },
});
