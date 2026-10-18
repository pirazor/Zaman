import React, { useEffect, useState } from 'react';
import { I18nManager } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider, useApp } from '../src/state/AppProvider';
import { ensureNativeLayoutLTR } from '../src/lib/layoutDirection';

// Reminders are the point of the app, so show them even while it is open —
// a user staring at the countdown should still get the 15-minute warning.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Holds the splash screen while native mirroring is switched off, so a phone
  // set to Arabic never shows a frame laid out in the wrong direction.
  const [layoutReady, setLayoutReady] = useState(!I18nManager.isRTL);

  useEffect(() => {
    void ensureNativeLayoutLTR().then((reloading) => {
      if (!reloading) setLayoutReady(true);
    });
  }, []);

  if (!layoutReady) return null;

  return (
    <SafeAreaProvider>
      <AppProvider>
        <RootNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}

function RootNavigator() {
  const { ready, onboarded, scheme, colors } = useApp();

  useEffect(() => {
    if (!ready) return;
    void SystemUI.setBackgroundColorAsync(colors.background);
    void SplashScreen.hideAsync();
  }, [ready, colors.background]);

  // Hold the splash screen rather than flashing an empty frame while the
  // stored language and location are read.
  if (!ready) return null;

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        {/*
          Guards rather than redirects: whichever branch is unreachable is
          removed from the navigation state entirely, so finishing the welcome
          screens moves to the tabs without a redirect flash, and there is no
          back gesture into onboarding afterwards.
        */}
        <Stack.Protected guard={onboarded}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="second-city"
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
        </Stack.Protected>

        <Stack.Protected guard={!onboarded}>
          <Stack.Screen name="welcome" />
        </Stack.Protected>
      </Stack>
    </>
  );
}
