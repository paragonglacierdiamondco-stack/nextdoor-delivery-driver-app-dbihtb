
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

export default function StartDeliveryScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Stack.Screen
        options={{
          title: 'Start Delivery',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <IconSymbol name="chevron.left" size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <IconSymbol name="play.circle.fill" size={64} color={colors.primary} />
        <Text style={styles.title}>Start Delivery Route</Text>
        <Text style={styles.subtitle}>Feature coming soon</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 8,
  },
});
