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
 * This screen only explains, in plain words, what location is for and that it
 * never leaves the phone. The single Continue button then always presents the
 * system permission dialog — the decision itself belongs to that dialog, per
 * App Review guideline 5.1.1(iv): a neutral button label, and no way to slip
 * past the request. Declining there is fully honoured; the app works with a
 * manually chosen city instead.
 */
export default function AllowLocation() {
  const { t, colors, refreshLocation } = useApp();
  const router = useRouter();
  const [requesting, setRequesting] = useState(false);

  const request = async () => {
    setRequesting(true);
    await refreshLocation();
    setRequesting(false);
    router.push('/welcome/reminders');
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
        <Button label={t('onboarding_continue')} onPress={request} loading={requesting} />
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
