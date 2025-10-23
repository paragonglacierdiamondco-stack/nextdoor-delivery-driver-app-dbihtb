
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

export default function NavigationScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Stack.Screen
        options={{
          title: 'Navigation',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <IconSymbol name="chevron.left" size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <View style={styles.mapPlaceholder}>
          <IconSymbol name="map.fill" size={64} color={colors.textSecondary} />
          <Text style={styles.placeholderTitle}>Map Navigation</Text>
          <Text style={styles.placeholderText}>
            Note: react-native-maps is not supported in Natively at this time.
          </Text>
          <Text style={styles.placeholderSubtext}>
            In a production app, this screen would display turn-by-turn navigation using a maps provider like Google Maps or Apple Maps.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <IconSymbol name="location.fill" size={20} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Destination</Text>
              <Text style={styles.infoValue}>123 Main St, Apt 4B</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <IconSymbol name="clock.fill" size={20} color={colors.secondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Estimated Arrival</Text>
              <Text style={styles.infoValue}>15 minutes</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <IconSymbol name="arrow.triangle.turn.up.right.circle.fill" size={20} color={colors.accent} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Distance</Text>
              <Text style={styles.infoValue}>3.2 miles</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => console.log('Start navigation')}
            activeOpacity={0.8}
          >
            <IconSymbol name="play.fill" size={20} color={colors.card} />
            <Text style={styles.primaryButtonText}>Start Navigation</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => console.log('Call customer')}
            activeOpacity={0.8}
          >
            <IconSymbol name="phone.fill" size={20} color={colors.primary} />
            <Text style={styles.secondaryButtonText}>Call Customer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.card,
    margin: 16,
    borderRadius: 12,
    padding: 32,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '500',
  },
  placeholderSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  actionButtons: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.card,
    marginLeft: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
});
