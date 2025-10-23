
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

export default function StatisticsScreen() {
  const router = useRouter();

  const todayStats = [
    { label: 'Deliveries', value: '12', change: '+3', icon: 'shippingbox.fill' },
    { label: 'Completed', value: '8', change: '+5', icon: 'checkmark.circle.fill' },
    { label: 'Pending', value: '4', change: '-2', icon: 'clock.fill' },
    { label: 'Earnings', value: '$96', change: '+$24', icon: 'dollarsign.circle.fill' },
  ];

  const weeklyStats = [
    { label: 'Total Deliveries', value: '67' },
    { label: 'Success Rate', value: '98.5%' },
    { label: 'Avg. Time per Delivery', value: '12 min' },
    { label: 'Total Distance', value: '234 mi' },
  ];

  const performanceMetrics = [
    { label: 'On-Time Delivery', value: '96%', color: colors.success },
    { label: 'Customer Rating', value: '4.9', color: colors.warning },
    { label: 'Package Handling', value: '99%', color: colors.success },
    { label: 'Route Efficiency', value: '94%', color: colors.secondary },
  ];

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Stack.Screen
        options={{
          title: 'Statistics',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <IconSymbol name="chevron.left" size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Today's Performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today&apos;s Performance</Text>
          <View style={styles.statsGrid}>
            {todayStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <IconSymbol name={stat.icon} size={24} color={colors.primary} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text
                  style={[
                    styles.statChange,
                    { color: stat.change.startsWith('+') ? colors.success : colors.error },
                  ]}
                >
                  {stat.change}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Weekly Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Summary</Text>
          <View style={styles.summaryCard}>
            {weeklyStats.map((stat, index) => (
              <View key={index}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{stat.label}</Text>
                  <Text style={styles.summaryValue}>{stat.value}</Text>
                </View>
                {index < weeklyStats.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>

        {/* Performance Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Metrics</Text>
          {performanceMetrics.map((metric, index) => (
            <View key={index} style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <Text style={[styles.metricValue, { color: metric.color }]}>
                  {metric.value}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: metric.value,
                      backgroundColor: metric.color,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Earnings Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Earnings Breakdown</Text>
          <View style={styles.earningsCard}>
            <View style={styles.earningsRow}>
              <Text style={styles.earningsLabel}>Base Pay</Text>
              <Text style={styles.earningsValue}>$280</Text>
            </View>
            <View style={styles.earningsRow}>
              <Text style={styles.earningsLabel}>Tips</Text>
              <Text style={styles.earningsValue}>$32</Text>
            </View>
            <View style={styles.earningsRow}>
              <Text style={styles.earningsLabel}>Bonuses</Text>
              <Text style={styles.earningsValue}>$8</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.earningsRow}>
              <Text style={styles.earningsTotalLabel}>Total This Week</Text>
              <Text style={styles.earningsTotalValue}>$320</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: '1%',
    marginBottom: 12,
    alignItems: 'center',
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 14,
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  metricCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  earningsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  earningsLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  earningsValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  earningsTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  earningsTotalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
});
