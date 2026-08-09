import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { OptionRow } from '../../src/components/OptionRow';
import { Screen } from '../../src/components/Screen';
import { Text } from '../../src/components/Text';
import { LANGUAGES, LANGUAGE_NAMES, translate } from '../../src/i18n';
import { useApp } from '../../src/state/AppProvider';
import { spacing } from '../../src/theme';

/**
 * Step one: confirm the language.
 *
 * The region-derived default is already selected, so most users can simply
 * press Continue. Each option is written in its own script, which is what
 * makes the screen usable to someone who cannot read the other two.
 */
export default function ChooseLanguage() {
  const { language, setLanguage, t, colors } = useApp();
  const router = useRouter();

  return (
    <Screen contentStyle={styles.screen}>
      <View style={styles.header}>
        <Text variant="title" weight="700" align="center">
          {t('appName')}
        </Text>
        <Text variant="body" color={colors.textMuted} align="center">
          {t('onboarding_chooseLanguage')}
        </Text>
      </View>

      <Card>
        {LANGUAGES.map((option) => (
          <OptionRow
            key={option}
            label={LANGUAGE_NAMES[option]}
            // A sample of the app's own copy in that language, so a speaker
            // can recognise their own before selecting it.
            description={translate(option, 'tabs_times')}
            selected={language === option}
            onPress={() => setLanguage(option)}
          />
        ))}
      </Card>

      <View style={styles.footer}>
        <Button label={t('onboarding_continue')} onPress={() => router.push('/welcome/location')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: spacing.xl,
  },
  header: {
    gap: spacing.sm,
  },
  footer: {
    gap: spacing.sm,
  },
});
