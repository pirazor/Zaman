import React from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { useApp } from '../state/AppProvider';
import { MIN_TOUCH_TARGET, radius, spacing } from '../theme';
import { Text } from './Text';

export interface OptionRowProps {
  label: string;
  description?: string;
  selected?: boolean;
  onPress?: () => void;
  /** Renders a switch instead of a tick. */
  toggle?: { value: boolean; onChange: (value: boolean) => void };
  disabled?: boolean;
}

/**
 * One selectable line in Settings.
 *
 * Selection is shown by a tick and a tinted background rather than by colour
 * alone, so it survives both colour-blindness and a dimmed screen. The whole
 * row is the target, never just the control.
 */
export function OptionRow({
  label,
  description,
  selected,
  onPress,
  toggle,
  disabled,
}: OptionRowProps) {
  const { colors, isRTL } = useApp();

  const body = (
    <View
      style={[
        styles.row,
        {
          flexDirection: isRTL ? 'row-reverse' : 'row',
          backgroundColor: selected ? colors.accentSoft : 'transparent',
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <View style={styles.labels}>
        <Text variant="body" weight={selected ? '700' : '500'}>
          {label}
        </Text>
        {description ? (
          <Text variant="caption" color={colors.textMuted}>
            {description}
          </Text>
        ) : null}
      </View>

      {toggle ? (
        <Switch
          value={toggle.value}
          onValueChange={toggle.onChange}
          disabled={disabled}
          trackColor={{ true: colors.primaryBright, false: colors.border }}
          thumbColor={colors.surface}
          // The row already carries the label; announcing it twice is noise.
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
      ) : selected ? (
        <MaterialCommunityIcons name="check" size={28} color={colors.primaryBright} />
      ) : null}
    </View>
  );

  if (toggle && !onPress) {
    return (
      <Pressable
        onPress={() => !disabled && toggle.onChange(!toggle.value)}
        disabled={disabled}
        accessibilityRole="switch"
        accessibilityLabel={label}
        accessibilityHint={description}
        accessibilityState={{ checked: toggle.value, disabled }}
      >
        {body}
      </Pressable>
    );
  }

  if (!onPress) return body;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityHint={description}
      accessibilityState={{ selected: !!selected, disabled }}
    >
      {body}
    </Pressable>
  );
}

export function SectionTitle({ children }: { children: string }) {
  const { colors } = useApp();
  return (
    <Text
      variant="label"
      weight="700"
      color={colors.textMuted}
      accessibilityRole="header"
      style={styles.sectionTitle}
    >
      {children.toLocaleUpperCase()}
    </Text>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: MIN_TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  labels: {
    flex: 1,
    gap: 2,
  },
  sectionTitle: {
    letterSpacing: 1,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.sm,
  },
});
