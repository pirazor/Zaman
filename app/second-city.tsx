import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { Button } from '../src/components/Button';
import { Card } from '../src/components/Card';
import { OptionRow } from '../src/components/OptionRow';
import { Screen } from '../src/components/Screen';
import { Text } from '../src/components/Text';
import { searchCities } from '../src/lib/cities';
import { useApp } from '../src/state/AppProvider';
import { fontSize, MIN_TOUCH_TARGET, radius, spacing } from '../src/theme';

/**
 * The second-city chooser, opened by tapping the chip on the home screen.
 * A modal sheet with the same search the Location settings use: type, tap a
 * city, and the sheet closes with the chip updated.
 */
export default function SecondCitySheet() {
  const { t, colors, language, isRTL, secondCity, setSecondCity } = useApp();
  const router = useRouter();
  const [query, setQuery] = useState('');

  const choose = (cityId: string) => {
    setSecondCity(cityId);
    router.back();
  };

  return (
    <Screen scroll contentStyle={styles.screen}>
      <Text variant="heading" weight="700" accessibilityRole="header">
        {t('settings_secondCity')}
      </Text>

      <Card>
        {secondCity ? <OptionRow label={secondCity.names[language]} selected /> : null}

        <View
          style={[
            styles.search,
            {
              flexDirection: isRTL ? 'row-reverse' : 'row',
              borderColor: colors.border,
              backgroundColor: colors.surfaceMuted,
            },
          ]}
        >
          <MaterialCommunityIcons name="magnify" size={26} color={colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('settings_searchCity')}
            placeholderTextColor={colors.textMuted}
            autoCorrect={false}
            autoFocus
            returnKeyType="search"
            accessibilityLabel={t('settings_searchCity')}
            style={[styles.input, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
          />
        </View>

        {searchCities(query)
          .filter((city) => city.id !== secondCity?.id)
          .map((city) => (
            <OptionRow
              key={city.id}
              label={city.names[language]}
              onPress={() => choose(city.id)}
            />
          ))}
      </Card>

      <Button label={t('settings_done')} variant="secondary" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: spacing.md,
  },
  search: {
    minHeight: MIN_TOUCH_TARGET,
    alignItems: 'center',
    gap: spacing.sm + 4,
    margin: spacing.xs,
    paddingHorizontal: spacing.md,
    borderWidth: 2,
    borderRadius: radius.md,
  },
  input: {
    flex: 1,
    minWidth: 0,
    fontSize: fontSize.body,
    fontWeight: '500',
    paddingVertical: 14,
  },
});
