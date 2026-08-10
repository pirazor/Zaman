import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type RefreshControlProps,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '../state/AppProvider';
import { spacing } from '../theme';

export interface ScreenProps {
  children: React.ReactNode;
  /** Wraps content in a scroll view. Off for screens that must not scroll. */
  scroll?: boolean;
  /** Extra bottom padding, e.g. to clear the tab bar. */
  bottomInset?: number;
  /**
   * Whether to reserve the home-indicator inset at the bottom. Screens inside
   * the tab navigator should pass `false`: the tab bar already occupies that
   * strip, and reserving it twice wastes about 34pt of a phone screen.
   */
  bottomSafeArea?: boolean;
  contentStyle?: ViewStyle;
  refreshControl?: React.ReactElement<RefreshControlProps>;
}

export function Screen({
  children,
  scroll = true,
  bottomInset = 0,
  bottomSafeArea = true,
  contentStyle,
  refreshControl,
}: ScreenProps) {
  const { colors } = useApp();
  const insets = useSafeAreaInsets();

  const padding: ViewStyle = {
    paddingTop: insets.top + spacing.sm,
    paddingBottom: (bottomSafeArea ? insets.bottom : 0) + bottomInset + spacing.md,
    paddingHorizontal: spacing.md,
  };

  if (!scroll) {
    return (
      <View style={[styles.fill, { backgroundColor: colors.background }, padding, contentStyle]}>
        {children}
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.fill, { backgroundColor: colors.background }]}
      contentContainerStyle={[padding, contentStyle]}
      refreshControl={refreshControl}
      // Older users often scroll with a finger resting on the screen; this
      // keeps momentum feeling normal rather than sticky.
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
