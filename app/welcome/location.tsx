import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { Button } from '../../src/components/Button';
import { Screen } from '../../src/components/Screen';
import { Text } from '../../src/components/Text';
import { useApp } from '../../src/state/AppProvider';
import { spacing } from '../../src/theme';

/**
 * Step two: location.
 *
 * The permission is requested only after this screen has explained, in plain
 * words, what it is for and that nothing leaves the phone. Users who decline
 * still reach the app; the home screen offers the prompt again.
 */
export default function AllowLocation() {
  const { t, colors, refreshLocation } = useApp();
  const router = useRouter();
  const [requesting, setRequesting] = useState(false);

  const next = () => router.push('/welcome/reminders');

  const request = async () => {
    setRequesting(true);
    await refreshLocation();
    setRequesting(false);
    next();
  };

  return (
    <Screen contentStyle={styles.screen}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="map-marker-radius-outline"
          size={72}
          color={colors.primary}
          style={styles.icon}
        />
        <Text variant="title" weight="700" align="center">
          {t('onboarding_locationTitle')}
        </Text>
        <Text variant="body" color={colors.textMuted} align="center" style={styles.body}>
          {t('onboarding_locationBody')}
        </Text>
      </View>

      <View style={styles.footer}>
        <Button
          label={t('onboarding_locationAllow')}
          onPress={request}
          loading={requesting}
        />
        <Button label={t('onboarding_skip')} variant="quiet" onPress={next} />
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
