import React, { useCallback, useMemo, useState } from 'react';
import { Linking, RefreshControl, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { NextPrayerCard } from '../../src/components/NextPrayerCard';
import { PrayerRow } from '../../src/components/PrayerRow';
import { Screen } from '../../src/components/Screen';
import { Text } from '../../src/components/Text';
import { useNow } from '../../src/hooks/useNow';
import {
  getDayTimetable,
  getTomorrowFajr,
  selectCurrentPrayer,
  selectNextPrayer,
  type Position,
  type PrayerSettings,
} from '../../src/lib/prayer';
import { formatGregorianDate, formatHijriDate } from '../../src/lib/time';
import { useApp } from '../../src/state/AppProvider';
import { spacing } from '../../src/theme';

/**
 * The home screen: where the user is, what is next, how long is left, and the
 * whole day at a glance. Nothing else.
 */
export default function PrayerTimesScreen() {
  const { position, prayerSettings } = useApp();

  if (!position) return <LocationPrompt />;
  return <Timetable position={position} prayerSettings={prayerSettings} />;
}

function Timetable({
  position,
  prayerSettings,
}: {
  position: Position;
  prayerSettings: PrayerSettings;
}) {
  const { place, t, colors, language, isRTL, refreshLocation } = useApp();
  const now = useNow();
  const [refreshing, setRefreshing] = useState(false);

  // Prayer times only change at midnight, so the solar calculation is keyed on
  // the calendar day. The one-second tick that drives the countdown then costs
  // nothing but a subtraction.
  const dayKey = now.toDateString();

  const { timetable, tomorrowFajr } = useMemo(
    () => ({
      timetable: getDayTimetable(position, prayerSettings, now),
      tomorrowFajr: getTomorrowFajr(position, prayerSettings, now),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [position.latitude, position.longitude, prayerSettings, dayKey],
  );

  const next = selectNextPrayer(timetable, tomorrowFajr, now);
  const current = selectCurrentPrayer(timetable, now);
  const hijri = formatHijriDate(now, language);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshLocation();
    setRefreshing(false);
  }, [refreshLocation]);

  return (
    <Screen
      bottomInset={spacing.lg}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
      contentStyle={styles.screen}
    >
      <View style={[styles.place, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <MaterialCommunityIcons name="map-marker-outline" size={22} color={colors.textMuted} />
        <Text variant="label" weight="600" color={colors.textMuted} style={styles.placeLabel}>
          {place?.label ?? t('home_unknownPlace')}
        </Text>
      </View>

      <View style={styles.dates}>
        <Text variant="heading" weight="700">
          {formatGregorianDate(now, language)}
        </Text>
        {hijri ? (
          <Text variant="body" color={colors.textMuted}>
            {hijri}
          </Text>
        ) : null}
      </View>

      <NextPrayerCard next={next} msRemaining={next.msRemaining} />

      <Card style={styles.timetable}>
        {timetable.entries.map((entry) => (
          <PrayerRow
            key={entry.slot}
            slot={entry.slot}
            time={entry.time}
            isCurrent={entry.slot === current}
            isNext={!next.isTomorrow && entry.slot === next.slot}
          />
        ))}
      </Card>
    </Screen>
  );
}

/**
 * Shown when there is no usable fix. Distinguishes a permission the user can
 * still grant in-app from one only the phone's settings can undo, because the
 * two need completely different instructions.
 */
function LocationPrompt() {
  const { t, colors, locationStatus, refreshLocation } = useApp();
  const [busy, setBusy] = useState(false);

  const blocked = locationStatus === 'blocked';
  const loading = busy || locationStatus === 'requesting';

  const retry = async () => {
    setBusy(true);
    await refreshLocation();
    setBusy(false);
  };

  return (
    <Screen scroll={false} contentStyle={styles.prompt}>
      <MaterialCommunityIcons
        name="map-marker-radius-outline"
        size={72}
        color={colors.primary}
        style={styles.promptIcon}
      />
      <Text variant="heading" weight="700" align="center">
        {loading ? t('home_locating') : t('home_locationOff')}
      </Text>
      {!loading ? (
        <Text variant="body" color={colors.textMuted} align="center" style={styles.promptBody}>
          {t('home_locationOffBody')}
        </Text>
      ) : null}

      <View style={styles.promptActions}>
        {blocked ? (
          <Button label={t('home_openSettings')} onPress={() => void Linking.openSettings()} />
        ) : (
          <Button label={t('home_turnOnLocation')} onPress={retry} loading={loading} />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: spacing.lg,
  },
  place: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  placeLabel: {
    flexShrink: 1,
  },
  dates: {
    gap: 2,
  },
  timetable: {
    gap: 2,
  },
  prompt: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.md,
  },
  promptIcon: {
    alignSelf: 'center',
  },
  promptBody: {
    lineHeight: 28,
  },
  promptActions: {
    marginTop: spacing.lg,
  },
});
