import React, { useCallback, useEffect, useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { OptionRow, SectionTitle } from '../../src/components/OptionRow';
import { Screen } from '../../src/components/Screen';
import { Text } from '../../src/components/Text';
import { LANGUAGES, LANGUAGE_NAMES } from '../../src/i18n';
import {
  getNotificationPermission,
  requestNotificationPermission,
  REMINDER_MINUTE_OPTIONS,
  type NotificationPermission,
} from '../../src/lib/notifications';
import { defaultMethodForRegion, SELECTABLE_METHODS } from '../../src/lib/prayer';
import { useApp } from '../../src/state/AppProvider';
import { spacing } from '../../src/theme';

/**
 * Settings.
 *
 * Everything here has a working default, so this screen is optional. Options
 * are laid out as flat lists of large rows rather than pickers or dropdowns:
 * every choice is visible at once and takes a single press.
 */
export default function SettingsScreen() {
  const {
    t,
    colors,
    language,
    setLanguage,
    method,
    methodIsAutomatic,
    setMethod,
    madhab,
    setMadhab,
    timeFormat,
    setTimeFormat,
    notificationsEnabled,
    setNotificationsEnabled,
    reminderMinutes,
    setReminderMinutes,
    region,
    place,
    refreshLocation,
  } = useApp();

  const [permission, setPermission] = useState<NotificationPermission>('granted');
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    void getNotificationPermission().then(setPermission);
  }, []);

  const toggleNotifications = useCallback(
    async (enabled: boolean) => {
      if (!enabled) {
        setNotificationsEnabled(false);
        return;
      }

      // Turning the switch on has to actually secure permission, or the
      // setting would claim reminders are on while none could be delivered.
      const result = await requestNotificationPermission();
      setPermission(result);
      setNotificationsEnabled(result === 'granted');
    },
    [setNotificationsEnabled],
  );

  const updateLocation = useCallback(async () => {
    setLocating(true);
    await refreshLocation();
    setLocating(false);
  }, [refreshLocation]);

  const automaticMethod = defaultMethodForRegion(region);
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <Screen bottomInset={spacing.lg} contentStyle={styles.screen}>
      <Text variant="title" weight="700" accessibilityRole="header">
        {t('settings_title')}
      </Text>

      <View>
        <SectionTitle>{t('settings_language')}</SectionTitle>
        <Card>
          {LANGUAGES.map((option) => (
            <OptionRow
              key={option}
              label={LANGUAGE_NAMES[option]}
              selected={language === option}
              onPress={() => setLanguage(option)}
            />
          ))}
        </Card>
      </View>

      <View>
        <SectionTitle>{t('settings_notifications')}</SectionTitle>
        <Card>
          <OptionRow
            label={t('settings_notificationsOn')}
            toggle={{ value: notificationsEnabled, onChange: toggleNotifications }}
            disabled={permission === 'blocked'}
          />
        </Card>

        {permission === 'blocked' ? (
          <View style={styles.notice}>
            <Text variant="caption" color={colors.warning}>
              {t('settings_notificationsBlocked')}
            </Text>
            <Button
              label={t('home_openSettings')}
              variant="secondary"
              onPress={() => void Linking.openSettings()}
            />
          </View>
        ) : null}

        {notificationsEnabled && permission !== 'blocked' ? (
          <Card style={styles.minutesCard}>
            {REMINDER_MINUTE_OPTIONS.map((minutes) => (
              <OptionRow
                key={minutes}
                label={t('settings_minutesBefore', { minutes })}
                selected={reminderMinutes === minutes}
                onPress={() => setReminderMinutes(minutes)}
              />
            ))}
          </Card>
        ) : null}
      </View>

      <View>
        <SectionTitle>{t('settings_timeFormat')}</SectionTitle>
        <Card>
          <OptionRow
            label={t('settings_timeFormat_12')}
            selected={timeFormat === '12h'}
            onPress={() => setTimeFormat('12h')}
          />
          <OptionRow
            label={t('settings_timeFormat_24')}
            selected={timeFormat === '24h'}
            onPress={() => setTimeFormat('24h')}
          />
        </Card>
      </View>

      <View>
        <SectionTitle>{t('settings_madhab')}</SectionTitle>
        <Card>
          <OptionRow
            label={t('settings_madhab_shafi')}
            selected={madhab === 'shafi'}
            onPress={() => setMadhab('shafi')}
          />
          <OptionRow
            label={t('settings_madhab_hanafi')}
            selected={madhab === 'hanafi'}
            onPress={() => setMadhab('hanafi')}
          />
        </Card>
      </View>

      <View>
        <SectionTitle>{t('settings_calculation')}</SectionTitle>
        <Card>
          <OptionRow
            label={t('settings_calculationAuto', { method: t(`method_${automaticMethod}`) })}
            description={t('settings_calculationAutoDesc')}
            selected={methodIsAutomatic}
            onPress={() => setMethod(undefined)}
          />
          {SELECTABLE_METHODS.map((option) => (
            <OptionRow
              key={option}
              label={t(`method_${option}`)}
              selected={!methodIsAutomatic && method === option}
              onPress={() => setMethod(option)}
            />
          ))}
        </Card>
      </View>

      <View>
        <SectionTitle>{t('settings_location')}</SectionTitle>
        <Card style={styles.locationCard}>
          <Text variant="body" weight="600">
            {place?.label ?? t('home_unknownPlace')}
          </Text>
          <Button
            label={t('settings_refreshLocation')}
            variant="secondary"
            onPress={updateLocation}
            loading={locating}
          />
        </Card>
      </View>

      <View>
        <SectionTitle>{t('settings_about')}</SectionTitle>
        <Card style={styles.aboutCard}>
          <Text variant="body" color={colors.textMuted} style={styles.aboutBody}>
            {t('settings_aboutBody')}
          </Text>
          <Text variant="caption" color={colors.textMuted}>
            {t('settings_version', { version })}
          </Text>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: spacing.md,
  },
  notice: {
    gap: spacing.sm,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  minutesCard: {
    marginTop: spacing.sm,
  },
  locationCard: {
    padding: spacing.md,
    gap: spacing.md,
  },
  aboutCard: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  aboutBody: {
    lineHeight: 28,
  },
});
