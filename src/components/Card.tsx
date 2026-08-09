import React from 'react';
import { View, type ViewProps } from 'react-native';

import { useApp } from '../state/AppProvider';
import { radius, shadow, spacing } from '../theme';

/** Raised surface used to group related rows. */
export function Card({ style, ...rest }: ViewProps) {
  const { colors } = useApp();

  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          padding: spacing.sm,
          borderWidth: 1,
          borderColor: colors.border,
        },
        shadow.card,
        style,
      ]}
    />
  );
}
