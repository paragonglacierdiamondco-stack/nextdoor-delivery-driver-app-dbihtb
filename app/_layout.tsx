
import React, { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { useFonts } from 'expo-font';
import { useColorScheme, Alert } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { WidgetProvider } from '@/contexts/WidgetContext';
import { AppProvider } from '@/contexts/AppContext';
import { useNetworkState } from 'expo-network';
import * as SplashScreen from 'expo-splash-screen';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const networkState = useNetworkState();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <WidgetProvider>
          <AppProvider>
            <SystemBars style="auto" />
            <StatusBar style="auto" />
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="scan-package" options={{ presentation: 'modal' }} />
              <Stack.Screen name="navigation" options={{ presentation: 'modal' }} />
              <Stack.Screen name="report-issue" options={{ presentation: 'modal' }} />
              <Stack.Screen name="statistics" options={{ presentation: 'modal' }} />
              <Stack.Screen name="start-delivery" options={{ presentation: 'modal' }} />
              <Stack.Screen name="delivery-details" options={{ presentation: 'modal' }} />
              <Stack.Screen name="delivery-confirmation" options={{ presentation: 'modal' }} />
            </Stack>
          </AppProvider>
        </WidgetProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
