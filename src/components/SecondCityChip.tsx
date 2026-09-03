import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { describeRemaining, describeRemainingShort } from '../i18n';
import { splitRemaining } from '../lib/duration';
import { nextPrayerForCity } from '../lib/secondCity';
import { formatTime } from '../lib/time';
import { useApp } from '../state/AppProvider';
import { radius, spacing } from '../theme';
import { Text } from './Text';

export interface SecondCityRowProps {
  /** Ticking clock from the home screen, so both countdowns share one beat. */
  now: Date;
  /** Opens the second-city chooser sheet. */
  onPressSecond: () => void;
  /** Jumps to the Location settings. */
  onPressPrimary: () => void;
}

/**
 * The home screen's top row: the user's own place on the left and, when the
 * feature is on, the second city on the right — its local clock and its next
 * prayer with the time remaining, mirroring the hero card's meaning.
 *
 * Sized for the same eyes as the rest of the app: both city names at full
 * body size, nothing below label size.
 */
export function SecondCityRow({ now, onPressSecond, onPressPrimary }: SecondCityRowProps) {
  const { colors, t, isRTL, language, timeFormat, place, secondCity } = useApp();

  const placeLabel = place?.label ?? t('home_unknownPlace');

  const second = secondCity
    ? (() => {
        const next = nextPrayerForCity(secondCity, now);
        const segments = splitRemaining(next.time.getTime() - now.getTime());
        return {
          name: secondCity.names[language],
          clock: formatTime(now, timeFormat, language, secondCity.timezone),
          prayer: t(`prayer_${next.slot}`),
          remaining: describeRemainingShort(language, segments),
          spoken: describeRemaining(language, segments),
        };
      })()
    : undefined;

  return (
    <View style={[styles.row, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
      <Pressable
        onPress={onPressPrimary}
        accessibilityRole="button"
        accessibilityLabel={placeLabel}
        accessibilityHint={t('settings_location')}
        style={({ pressed }) => [
          styles.primary,
          { flexDirection: isRTL ? 'row-reverse' : 'row', opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <MaterialCommunityIcons name="map-marker-outline" size={24} color={colors.textMuted} />
        <Text variant="body" weight="600" style={styles.primaryLabel}>
          {placeLabel}
        </Text>
      </Pressable>

      {second ? (
        <Pressable
          onPress={onPressSecond}
          accessibilityRole="button"
          accessibilityLabel={`${second.name}, ${second.clock}. ${second.prayer}: ${second.spoken}`}
          accessibilityHint={t('settings_secondCity')}
          style={({ pressed }) => [
            styles.second,
            { backgroundColor: colors.accentSoft, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text
            variant="body"
            weight="700"
            tabular
            align={isRTL ? 'left' : 'right'}
            style={styles.secondLine}
          >
            {second.name} · {second.clock}
          </Text>
          <Text
            variant="label"
            weight="600"
            tabular
            color={colors.accent}
            align={isRTL ? 'left' : 'right'}
            style={styles.secondInfo}
          >
            {second.prayer} · {second.remaining}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'stretch',
    gap: spacing.sm,
  },
  primary: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 44,
  },
  primaryLabel: {
    flexShrink: 1,
  },
  second: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    justifyContent: 'center',
  },
  secondLine: {
    lineHeight: 24,
  },
  secondInfo: {
    lineHeight: 20,
  },
});
