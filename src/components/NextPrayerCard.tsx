import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useApp } from '../state/AppProvider';
import { describeRemaining, unitLabel } from '../i18n';
import { splitRemaining } from '../lib/duration';
import type { UpcomingPrayer } from '../lib/prayer';
import { formatTime } from '../lib/time';
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
  const { colors, t, timeFormat, isRTL, language, timeZone } = useApp();

  const name = t(`prayer_${next.slot}`);
  const at = formatTime(next.time, timeFormat, language, timeZone);

  const segments = splitRemaining(msRemaining);
  const spoken = describeRemaining(language, segments);

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

      {/*
        Named units rather than a "1:33:00" clock face: the digits carry the
        size, the words carry the meaning. The row wraps to a second line
        rather than shrinking, so a long span or an enlarged system font
        stays at full size.
      */}
      <View
        style={[styles.countdown, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
        accessible
        accessibilityRole="text"
        accessibilityLabel={`${t('home_timeLeft')}: ${spoken}`}
      >
        {segments.length === 0 ? (
          <Text variant="display" weight="700" color={colors.onPrimary}>
            {t('home_now')}
          </Text>
        ) : (
          segments.map((segment) => (
            <View
              key={segment.unit}
              style={[styles.segment, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            >
              <Text variant="display" weight="700" tabular color={colors.onPrimary}>
                {segment.value}
              </Text>
              <Text variant="heading" weight="600" color={colors.onPrimaryMuted}>
                {unitLabel(language, segment.unit, segment.value)}
              </Text>
            </View>
          ))
        )}
      </View>

      <Text variant="label" color={colors.onPrimaryMuted} align="center">
        {t('home_timeLeft')}
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    // Off the scale on purpose: this card is the biggest single block on the
    // home screen, so its vertical padding is the dial that trades breathing
    // room against fitting the whole day on a phone without scrolling.
    paddingVertical: 18,
    gap: 2,
  },
  eyebrow: {
    letterSpacing: 1.2,
    fontSize: fontSize.caption,
  },
  headline: {
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  name: {
    flexShrink: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth * 3,
    opacity: 0.35,
    marginVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  countdown: {
    flexWrap: 'wrap',
    alignItems: 'baseline',
    justifyContent: 'center',
    columnGap: spacing.md,
    rowGap: spacing.xs,
    minHeight: fontSize.display * 1.15,
  },
  segment: {
    alignItems: 'baseline',
    columnGap: spacing.sm,
  },
});
