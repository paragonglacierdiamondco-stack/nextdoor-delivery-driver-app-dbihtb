
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
import { useApp, DeliveryStatus } from '@/contexts/AppContext';

export default function DeliveriesScreen() {
  const router = useRouter();
  const { deliveries, updateDelivery } = useApp();
  const [filter, setFilter] = useState<'all' | DeliveryStatus>('all');

  // Sort deliveries by route order assigned by dispatch
  const sortedDeliveries = [...deliveries].sort((a, b) => {
    const orderA = a.routeOrder || 999;
    const orderB = b.routeOrder || 999;
    return orderA - orderB;
  });

  const filteredDeliveries = filter === 'all'
    ? sortedDeliveries
    : sortedDeliveries.filter(d => d.status === filter);

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

  const handleStartDelivery = async (deliveryId: string) => {
    await updateDelivery(deliveryId, {
      status: 'in-progress',
      startedAt: new Date().toISOString(),
    });
    console.log('Started delivery:', deliveryId);
  };

  const handleCompleteDelivery = (deliveryId: string) => {
    router.push(`/delivery-confirmation?id=${deliveryId}` as any);
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
        <View style={styles.routeNotice}>
          <IconSymbol name="map.fill" size={18} color={colors.primary} />
          <Text style={styles.routeNoticeText}>
            Route optimized by dispatch
          </Text>
        </View>

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
                    {delivery.routeOrder && (
                      <View style={styles.routeOrderBadge}>
                        <Text style={styles.routeOrderText}>#{delivery.routeOrder}</Text>
                      </View>
                    )}
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
                  {delivery.packageCount && delivery.packageCount > 1 && (
                    <View style={styles.packageCountContainer}>
                      <IconSymbol name="shippingbox.fill" size={16} color={colors.primary} />
                      <Text style={styles.packageCountText}>
                        {delivery.packageCount} packages at this stop
                      </Text>
                    </View>
                  )}
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
                      onPress={() => handleStartDelivery(delivery.id)}
                    >
                      <IconSymbol name="play.fill" size={16} color={colors.card} />
                      <Text style={styles.actionButtonText}>Start</Text>
                    </TouchableOpacity>
                  )}
                  {delivery.status === 'in-progress' && (
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: colors.success }]}
                      onPress={() => handleCompleteDelivery(delivery.id)}
                    >
                      <IconSymbol name="checkmark" size={16} color={colors.card} />
                      <Text style={styles.actionButtonText}>Complete</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.navigationButton}
                    onPress={() => router.push(`/navigation?id=${delivery.id}` as any)}
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
  routeNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  routeNoticeText: {
    fontSize: 13,
    color: colors.text,
    marginLeft: 8,
    fontWeight: '500',
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
    flex: 1,
  },
  routeOrderBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  routeOrderText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.card,
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
  packageCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 4,
  },
  packageCountText: {
    fontSize: 13,
    color: colors.text,
    marginLeft: 8,
    fontWeight: '600',
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
