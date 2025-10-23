
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

interface DeliveryBlock {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  area: string;
  estimatedPackages: number;
  rate: string;
  status: 'available' | 'scheduled' | 'completed';
}

export default function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const deliveryBlocks: DeliveryBlock[] = [
    {
      id: '1',
      date: 'Today',
      startTime: '8:00 AM',
      endTime: '12:00 PM',
      duration: '4 hours',
      area: 'Downtown',
      estimatedPackages: 25,
      rate: '$80',
      status: 'scheduled',
    },
    {
      id: '2',
      date: 'Today',
      startTime: '1:00 PM',
      endTime: '5:00 PM',
      duration: '4 hours',
      area: 'Suburbs',
      estimatedPackages: 30,
      rate: '$90',
      status: 'available',
    },
    {
      id: '3',
      date: 'Tomorrow',
      startTime: '9:00 AM',
      endTime: '1:00 PM',
      duration: '4 hours',
      area: 'North Side',
      estimatedPackages: 20,
      rate: '$75',
      status: 'available',
    },
    {
      id: '4',
      date: 'Tomorrow',
      startTime: '2:00 PM',
      endTime: '6:00 PM',
      duration: '4 hours',
      area: 'East Side',
      estimatedPackages: 28,
      rate: '$85',
      status: 'available',
    },
  ];

  const upcomingSchedule = deliveryBlocks.filter(b => b.status === 'scheduled');
  const availableBlocks = deliveryBlocks.filter(b => b.status === 'available');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return colors.success;
      case 'scheduled':
        return colors.secondary;
      case 'completed':
        return colors.textSecondary;
      default:
        return colors.textSecondary;
    }
  };

  const handleScheduleBlock = (blockId: string) => {
    console.log('Scheduling block:', blockId);
  };

  return (
    <SafeAreaView style={commonStyles.safeArea} edges={['top']}>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Schedule',
            headerLargeTitle: true,
          }}
        />
      )}
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS !== 'ios' && styles.scrollContentWithTabBar,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Weekly Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>This Week</Text>
          <View style={styles.summaryStats}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>16</Text>
              <Text style={styles.summaryLabel}>Hours Scheduled</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>$320</Text>
              <Text style={styles.summaryLabel}>Estimated Earnings</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>103</Text>
              <Text style={styles.summaryLabel}>Total Packages</Text>
            </View>
          </View>
        </View>

        {/* Upcoming Schedule */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Schedule</Text>
            <TouchableOpacity>
              <Text style={styles.sectionLink}>View All</Text>
            </TouchableOpacity>
          </View>

          {upcomingSchedule.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="calendar" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyStateText}>No scheduled blocks</Text>
              <Text style={styles.emptyStateSubtext}>
                Browse available blocks below
              </Text>
            </View>
          ) : (
            upcomingSchedule.map((block) => (
              <View key={block.id} style={styles.blockCard}>
                <View style={styles.blockHeader}>
                  <View style={styles.blockHeaderLeft}>
                    <View
                      style={[
                        styles.statusIndicator,
                        { backgroundColor: getStatusColor(block.status) },
                      ]}
                    />
                    <Text style={styles.blockDate}>{block.date}</Text>
                  </View>
                  <View style={styles.rateContainer}>
                    <Text style={styles.rateText}>{block.rate}</Text>
                  </View>
                </View>

                <View style={styles.blockBody}>
                  <View style={styles.blockRow}>
                    <IconSymbol name="clock.fill" size={16} color={colors.textSecondary} />
                    <Text style={styles.blockText}>
                      {block.startTime} - {block.endTime} ({block.duration})
                    </Text>
                  </View>
                  <View style={styles.blockRow}>
                    <IconSymbol name="location.fill" size={16} color={colors.textSecondary} />
                    <Text style={styles.blockText}>{block.area}</Text>
                  </View>
                  <View style={styles.blockRow}>
                    <IconSymbol name="shippingbox.fill" size={16} color={colors.textSecondary} />
                    <Text style={styles.blockText}>
                      ~{block.estimatedPackages} packages
                    </Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancel Block</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Available Blocks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Blocks</Text>
            <TouchableOpacity>
              <IconSymbol name="slider.horizontal.3" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {availableBlocks.map((block) => (
            <View key={block.id} style={styles.blockCard}>
              <View style={styles.blockHeader}>
                <View style={styles.blockHeaderLeft}>
                  <View
                    style={[
                      styles.statusIndicator,
                      { backgroundColor: getStatusColor(block.status) },
                    ]}
                  />
                  <Text style={styles.blockDate}>{block.date}</Text>
                </View>
                <View style={[styles.rateContainer, { backgroundColor: colors.success + '20' }]}>
                  <Text style={[styles.rateText, { color: colors.success }]}>
                    {block.rate}
                  </Text>
                </View>
              </View>

              <View style={styles.blockBody}>
                <View style={styles.blockRow}>
                  <IconSymbol name="clock.fill" size={16} color={colors.textSecondary} />
                  <Text style={styles.blockText}>
                    {block.startTime} - {block.endTime} ({block.duration})
                  </Text>
                </View>
                <View style={styles.blockRow}>
                  <IconSymbol name="location.fill" size={16} color={colors.textSecondary} />
                  <Text style={styles.blockText}>{block.area}</Text>
                </View>
                <View style={styles.blockRow}>
                  <IconSymbol name="shippingbox.fill" size={16} color={colors.textSecondary} />
                  <Text style={styles.blockText}>
                    ~{block.estimatedPackages} packages
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.scheduleButton}
                onPress={() => handleScheduleBlock(block.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.scheduleButtonText}>Schedule Block</Text>
              </TouchableOpacity>
            </View>
          ))}
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
    paddingBottom: 20,
  },
  scrollContentWithTabBar: {
    paddingBottom: 100,
  },
  summaryCard: {
    backgroundColor: colors.primary,
    margin: 16,
    borderRadius: 16,
    padding: 20,
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.card,
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.card,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.card,
    textAlign: 'center',
    opacity: 0.9,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: colors.card,
    opacity: 0.3,
    marginHorizontal: 8,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: colors.card,
    borderRadius: 12,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  blockCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  blockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  blockHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  blockDate: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  rateContainer: {
    backgroundColor: colors.highlight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  rateText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  blockBody: {
    marginBottom: 12,
  },
  blockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  blockText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  scheduleButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  scheduleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.card,
  },
  cancelButton: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.error,
  },
});
