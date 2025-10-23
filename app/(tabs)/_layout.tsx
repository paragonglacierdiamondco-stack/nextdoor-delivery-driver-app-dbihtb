
import React from 'react';
import { Platform } from 'react-native';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'house.fill',
      label: 'Home',
    },
    {
      name: 'deliveries',
      route: '/(tabs)/deliveries',
      icon: 'shippingbox.fill',
      label: 'Deliveries',
    },
    {
      name: 'schedule',
      route: '/(tabs)/schedule',
      icon: 'calendar',
      label: 'Schedule',
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      icon: 'person.fill',
      label: 'Profile',
    },
  ];

  if (Platform.OS === 'ios') {
    return (
      <NativeTabs>
        <NativeTabs.Trigger name="(home)">
          <Icon sf="house.fill" drawable="ic_home" />
          <Label>Home</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="deliveries">
          <Icon sf="shippingbox.fill" drawable="ic_deliveries" />
          <Label>Deliveries</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="schedule">
          <Icon sf="calendar" drawable="ic_schedule" />
          <Label>Schedule</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="profile">
          <Icon sf="person.fill" drawable="ic_profile" />
          <Label>Profile</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen name="(home)" />
        <Stack.Screen name="deliveries" />
        <Stack.Screen name="schedule" />
        <Stack.Screen name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
