import React, { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { CompassDial } from '../../src/components/CompassDial';
import { Screen } from '../../src/components/Screen';
import { Text } from '../../src/components/Text';
import { useCompassHeading } from '../../src/hooks/useCompassHeading';
import { distanceToKaabaKm, isAligned, qiblaBearing, turnAngle } from '../../src/lib/qibla';
import { useApp } from '../../src/state/AppProvider';
import { spacing } from '../../src/theme';

/**
 * The Qibla screen.
 *
 * The instruction is physical, not numerical: turn until the gold Kaaba meets
 * the pointer at the top. The bearing in degrees is shown underneath for
 * anyone who wants it, and a short vibration confirms alignment so the screen
 * does not have to be watched while turning.
 */
export default function QiblaScreen() {
  const { position, t, colors } = useApp();
  const { width } = useWindowDimensions();
  const compass = useCompassHeading();

  const bearing = useMemo(() => (position ? qiblaBearing(position) : undefined), [position]);
  const distance = useMemo(() => (position ? distanceToKaabaKm(position) : undefined), [position]);

  const heading = compass.heading;
  const aligned =
    heading !== undefined && bearing !== undefined && isAligned(heading, bearing);

  // Confirm alignment once per arrival, not on every frame while held there.
  const wasAligned = useRef(false);
  useEffect(() => {
    if (aligned && !wasAligned.current) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    wasAligned.current = aligned;
  }, [aligned]);

  if (!position || bearing === undefined) {
    return (
      <Message
        icon="map-marker-radius-outline"
        title={t('qibla_title')}
        body={t('qibla_needLocation')}
      />
    );
  }

  // No magnetometer: the app cannot point, but it still knows the answer, so
  // it gives the bearing rather than an error.
  if (!compass.checking && !compass.available) {
    return (
      <Message
        icon="compass-off-outline"
        title={t('qibla_noCompass')}
        body={t('qibla_noCompassBody', { degrees: Math.round(bearing) })}
      />
    );
  }

  const dialSize = Math.min(width - spacing.md * 2, 360);
  const turn = heading !== undefined ? turnAngle(heading, bearing) : 0;

  const guidance = aligned
    ? t('qibla_facing')
    : turn > 0
      ? t('qibla_turnRight')
      : t('qibla_turnLeft');

  return (
    <Screen scroll={false} bottomInset={spacing.lg} contentStyle={styles.screen}>
      <Text variant="heading" weight="700" align="center">
        {t('qibla_title')}
      </Text>

      <View style={styles.dial}>
        <CompassDial
          size={dialSize}
          heading={heading ?? 0}
          qiblaBearing={bearing}
          aligned={aligned}
        />
      </View>

      <View
        style={styles.readout}
        accessible
        accessibilityRole="text"
        accessibilityLabel={`${guidance}. ${t('qibla_fromNorth', { degrees: Math.round(bearing) })}`}
        // The heading changes continuously; announcing every frame would make
        // the screen unusable with a screen reader.
        accessibilityLiveRegion="none"
      >
        <Text
          variant="heading"
          weight="700"
          align="center"
          color={aligned ? colors.success : colors.text}
        >
          {guidance}
        </Text>

        <Text variant="body" color={colors.textMuted} align="center" tabular>
          {t('qibla_fromNorth', { degrees: Math.round(bearing) })}
          {distance !== undefined
            ? ` · ${t('qibla_distance', { distance: Math.round(distance).toLocaleString('en-US') })}`
            : ''}
        </Text>

        <Text variant="caption" color={colors.textMuted} align="center" style={styles.hint}>
          {compass.accuracy > 0 && compass.accuracy < 2
            ? t('qibla_calibrate')
            : t('qibla_instruction')}
        </Text>
      </View>
    </Screen>
  );
}

function Message({
  icon,
  title,
  body,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  body: string;
}) {
  const { colors } = useApp();

  return (
    <Screen scroll={false} contentStyle={styles.message}>
      <MaterialCommunityIcons
        name={icon}
        size={72}
        color={colors.primary}
        style={styles.messageIcon}
      />
      <Text variant="heading" weight="700" align="center">
        {title}
      </Text>
      <Text variant="body" color={colors.textMuted} align="center" style={styles.messageBody}>
        {body}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  dial: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 1,
  },
  readout: {
    gap: spacing.xs,
  },
  hint: {
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  message: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.md,
  },
  messageIcon: {
    alignSelf: 'center',
  },
  messageBody: {
    lineHeight: 28,
  },
});
