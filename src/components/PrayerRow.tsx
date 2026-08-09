import React from 'react';
import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { useApp } from '../state/AppProvider';
import type { PrayerSlot } from '../lib/prayer';
import { formatTime } from '../lib/time';
import { MIN_TOUCH_TARGET, radius, spacing } from '../theme';
import { Text } from './Text';

/** A glyph per time of day, so the list can be scanned without reading it. */
const ICONS: Record<PrayerSlot, React.ComponentProps<typeof MaterialCommunityIcons>['name']> = {
  fajr: 'weather-night-partly-cloudy',
  sunrise: 'weather-sunset-up',
  dhuhr: 'white-balance-sunny',
  asr: 'weather-sunny',
  maghrib: 'weather-sunset-down',
  isha: 'weather-night',
};

export interface PrayerRowProps {
  slot: PrayerSlot;
  time: Date;
  /** The prayer period currently in force. Tinted and marked in the list. */
  isCurrent?: boolean;
  /** The prayer being counted down to. */
  isNext?: boolean;
}

export function PrayerRow({ slot, time, isCurrent, isNext }: PrayerRowProps) {
  const { colors, t, timeFormat, isRTL } = useApp();

  // Sunrise is not a prayer: it is shown for reference, so it recedes.
  const isSunrise = slot === 'sunrise';
  const highlighted = isCurrent || isNext;

  const label = t(`prayer_${slot}`);
  const formatted = formatTime(time, timeFormat);

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${label}, ${formatted}${isNext ? `. ${t('home_next')}` : ''}`}
      style={[
        styles.row,
        {
          flexDirection: isRTL ? 'row-reverse' : 'row',
          backgroundColor: highlighted ? colors.accentSoft : 'transparent',
          borderRadius: radius.md,
        },
      ]}
    >
      <MaterialCommunityIcons
        name={ICONS[slot]}
        size={28}
        color={highlighted ? colors.accent : isSunrise ? colors.textMuted : colors.primary}
      />

      <Text
        variant="prayer"
        weight={highlighted ? '700' : '500'}
        color={isSunrise && !highlighted ? colors.textMuted : colors.text}
        style={styles.label}
      >
        {label}
      </Text>

      <Text
        variant="prayer"
        weight={highlighted ? '700' : '600'}
        tabular
        color={isSunrise && !highlighted ? colors.textMuted : colors.text}
      >
        {formatted}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: MIN_TOUCH_TARGET,
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  label: {
    flex: 1,
  },
});
