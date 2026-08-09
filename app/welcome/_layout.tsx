import React from 'react';
import { Stack } from 'expo-router';

import { useApp } from '../../src/state/AppProvider';

export default function WelcomeLayout() {
  const { colors } = useApp();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        // No swipe-back: each step must be completed or explicitly skipped, so
        // a user cannot end up half-configured by an accidental gesture.
        gestureEnabled: false,
      }}
    />
  );
}
