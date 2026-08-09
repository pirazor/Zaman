import React from 'react';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { useApp } from '../../src/state/AppProvider';
import { fontSize } from '../../src/theme';

/**
 * Three tabs, always labelled, always visible. The app has no nested
 * navigation at all: every screen is one press from every other screen, and
 * nothing is hidden behind an unlabelled icon or a gesture.
 */
export default function TabsLayout() {
  const { colors, t } = useApp();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: Platform.select({ ios: 92, default: 76 }),
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: fontSize.caption,
          fontWeight: '600',
          paddingBottom: Platform.select({ ios: 0, default: 8 }),
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs_times'),
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="clock-time-four-outline" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="qibla"
        options={{
          title: t('tabs_qibla'),
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="compass-outline" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs_settings'),
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog-outline" size={30} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
