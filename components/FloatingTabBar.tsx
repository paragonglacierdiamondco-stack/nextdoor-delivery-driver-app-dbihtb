
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { useRouter, usePathname } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { colors } from '@/styles/commonStyles';

export interface TabBarItem {
  name: string;
  route: string;
  icon: string;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

export default function FloatingTabBar({
  tabs,
  containerWidth = Dimensions.get('window').width - 32,
  borderRadius = 24,
  bottomMargin = 16,
}: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabPress = (route: string) => {
    router.push(route as any);
  };

  const isActive = (route: string) => {
    if (route === '/(tabs)/(home)/') {
      return pathname === '/' || pathname.startsWith('/(tabs)/(home)');
    }
    return pathname.startsWith(route);
  };

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[
        styles.container,
        {
          bottom: bottomMargin,
        },
      ]}
    >
      <BlurView
        intensity={80}
        tint="light"
        style={[
          styles.tabBar,
          {
            width: containerWidth,
            borderRadius: borderRadius,
          },
        ]}
      >
        {tabs.map((tab) => {
          const active = isActive(tab.route);
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tab}
              onPress={() => handleTabPress(tab.route)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  active && styles.iconContainerActive,
                ]}
              >
                <IconSymbol
                  name={tab.icon}
                  size={24}
                  color={active ? colors.primary : colors.text}
                />
              </View>
              <Text
                style={[
                  styles.label,
                  active && styles.labelActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 8,
    paddingHorizontal: 8,
    boxShadow: `0px 4px 16px ${colors.shadow}`,
    elevation: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    marginBottom: 4,
  },
  iconContainerActive: {
    transform: [{ scale: 1.1 }],
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.text,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});
