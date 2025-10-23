
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

type DeliveryStatus = 'pending' | 'in-progress' | 'delivered' | 'exception';

interface Delivery {
  id: string;
  packageNumber: string;
  recipient: string;
  address: string;
  status: DeliveryStatus;
  priority: 'high' | 'normal' | 'low';
  timeWindow: string;
  notes?: string;
}

export default function DeliveriesScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | DeliveryStatus>('all');

  const deliveries: Delivery[] = [
    {
      id: '1',
      packageNumber: 'PKG-12345',
      recipient: 'John Smith',
      address: '123 Main St, Apt 4B',
      status: 'pending',
      priority: 'high',
      timeWindow: '10:00 AM - 12:00 PM',
      notes: 'Leave at door if no answer',
    },
    {
      id: '2',
      packageNumber: 'PKG-12346',
      recipient: 'Sarah Johnson',
      address: '456 Oak Ave',
      status: 'in-progress',
      priority: 'normal',
      timeWindow: '12:00 PM - 2:00 PM',
    },
    {
      id: '3',
      packageNumber: 'PKG-12347',
      recipient: 'Mike Davis',
      address: '789 Pine Rd, Unit 12',
      status: 'delivered',
      priority: 'normal',
      timeWindow: '9:00 AM - 11:00 AM',
    },
    {
      id: '4',
      packageNumber: 'PKG-12348',
      recipient: 'Emily Brown',
      address: '321 Elm St',
      status: 'pending',
      priority: 'low',
      timeWindow: '2:00 PM - 4:00 PM',
    },
    {
      id: '5',
      packageNumber: 'PKG-12349',
      recipient: 'David Wilson',
      address: '654 Maple Dr',
      status: 'exception',
      priority: 'high',
      timeWindow: '11:00 AM - 1:00 PM',
      notes: 'Address not found',
    },
  ];

  const filteredDeliveries = filter === 'all'
    ? deliveries
    : deliveries.filter(d => d.status === filter);

  const getStatusColor = (status: DeliveryStatus) => {
    switch (status) {
      case 'pending':
        return colors.warning;
      case 'in-progress':
        return colors.secondary;
      case 'delivered':
        return colors.success;
      case 'exception':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusLabel = (status: DeliveryStatus) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in-progress':
        return 'In Progress';
      case 'delivered':
        return 'Delivered';
      case 'exception':
        return 'Exception';
      default:
        return status;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'exclamationmark.circle.fill';
      case 'normal':
        return 'circle.fill';
      case 'low':
        return 'circle';
      default:
        return 'circle';
    }
  };

  const filters: Array<{ label: string; value: 'all' | DeliveryStatus }> = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Exceptions', value: 'exception' },
  ];

  return (
    <SafeAreaView style={commonStyles.safeArea} edges={['top']}>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Deliveries',
            headerLargeTitle: true,
          }}
        />
      )}
      <View style={styles.container}>
        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {filters.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.filterTab,
                filter === item.value && styles.filterTabActive,
              ]}
              onPress={() => setFilter(item.value)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterTabText,
                  filter === item.value && styles.filterTabTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Deliveries List */}
        <ScrollView
          style={styles.listContainer}
          contentContainerStyle={[
            styles.listContent,
            Platform.OS !== 'ios' && styles.listContentWithTabBar,
          ]}
          showsVerticalScrollIndicator={false}
        >
          {filteredDeliveries.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="shippingbox" size={64} color={colors.textSecondary} />
              <Text style={styles.emptyStateText}>No deliveries found</Text>
            </View>
          ) : (
            filteredDeliveries.map((delivery) => (
              <TouchableOpacity
                key={delivery.id}
                style={styles.deliveryCard}
                onPress={() => router.push(`/delivery-details?id=${delivery.id}` as any)}
                activeOpacity={0.7}
              >
                <View style={styles.deliveryHeader}>
                  <View style={styles.deliveryHeaderLeft}>
                    <IconSymbol
                      name={getPriorityIcon(delivery.priority)}
                      size={16}
                      color={delivery.priority === 'high' ? colors.error : colors.textSecondary}
                    />
                    <Text style={styles.packageNumber}>{delivery.packageNumber}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(delivery.status) + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(delivery.status) },
                      ]}
                    >
                      {getStatusLabel(delivery.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.deliveryBody}>
                  <View style={styles.deliveryRow}>
                    <IconSymbol name="person.fill" size={16} color={colors.textSecondary} />
                    <Text style={styles.deliveryText}>{delivery.recipient}</Text>
                  </View>
                  <View style={styles.deliveryRow}>
                    <IconSymbol name="location.fill" size={16} color={colors.textSecondary} />
                    <Text style={styles.deliveryText}>{delivery.address}</Text>
                  </View>
                  <View style={styles.deliveryRow}>
                    <IconSymbol name="clock.fill" size={16} color={colors.textSecondary} />
                    <Text style={styles.deliveryText}>{delivery.timeWindow}</Text>
                  </View>
                  {delivery.notes && (
                    <View style={styles.notesContainer}>
                      <IconSymbol name="note.text" size={16} color={colors.primary} />
                      <Text style={styles.notesText}>{delivery.notes}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.deliveryFooter}>
                  {delivery.status === 'pending' && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => router.push('/start-delivery' as any)}
                    >
                      <IconSymbol name="play.fill" size={16} color={colors.card} />
                      <Text style={styles.actionButtonText}>Start</Text>
                    </TouchableOpacity>
                  )}
                  {delivery.status === 'in-progress' && (
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: colors.success }]}
                      onPress={() => router.push('/delivery-confirmation' as any)}
                    >
                      <IconSymbol name="checkmark" size={16} color={colors.card} />
                      <Text style={styles.actionButtonText}>Complete</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.navigationButton}
                    onPress={() => router.push('/navigation' as any)}
                  >
                    <IconSymbol name="map.fill" size={16} color={colors.primary} />
                    <Text style={styles.navigationButtonText}>Navigate</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterContainer: {
    maxHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: colors.background,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  filterTabTextActive: {
    color: colors.card,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  listContentWithTabBar: {
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
  deliveryCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deliveryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  packageNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  deliveryBody: {
    marginBottom: 12,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deliveryText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
    flex: 1,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.highlight,
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  notesText: {
    fontSize: 13,
    color: colors.text,
    marginLeft: 8,
    flex: 1,
  },
  deliveryFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.card,
    marginLeft: 6,
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  navigationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 6,
  },
});
