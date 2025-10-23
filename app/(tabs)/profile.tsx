
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useApp } from '@/contexts/AppContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { statistics, logout } = useApp();

  const stats = [
    { 
      label: 'Total Deliveries', 
      value: statistics.totalDeliveries.toString(), 
      icon: 'shippingbox.fill' 
    },
    { 
      label: 'Success Rate', 
      value: `${statistics.successRate.toFixed(1)}%`, 
      icon: 'checkmark.circle.fill' 
    },
    { 
      label: 'Total Earnings', 
      value: `$${statistics.totalEarnings.toLocaleString()}`, 
      icon: 'dollarsign.circle.fill' 
    },
    { 
      label: 'Rating', 
      value: statistics.rating.toFixed(1), 
      icon: 'star.fill' 
    },
  ];

  const menuItems = [
    {
      title: 'Personal Information',
      icon: 'person.fill',
      route: '/personal-info',
    },
    {
      title: 'Vehicle Information',
      icon: 'car.fill',
      route: '/vehicle-info',
    },
    {
      title: 'Payment Methods',
      icon: 'creditcard.fill',
      route: '/payment-methods',
    },
    {
      title: 'Delivery History',
      icon: 'clock.arrow.circlepath',
      route: '/delivery-history',
    },
    {
      title: 'Performance Metrics',
      icon: 'chart.bar.fill',
      route: '/statistics',
    },
    {
      title: 'Settings',
      icon: 'gear',
      route: '/settings',
    },
    {
      title: 'Help & Support',
      icon: 'questionmark.circle.fill',
      route: '/support',
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            console.log('User signed out');
          },
        },
      ]
    );
  };

  const handleMenuPress = (route: string) => {
    if (route === '/statistics') {
      router.push(route as any);
    } else {
      Alert.alert('Coming Soon', 'This feature will be available in a future update.');
    }
  };

  return (
    <SafeAreaView style={commonStyles.safeArea} edges={['top']}>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Profile',
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
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <IconSymbol name="person.fill" size={48} color={colors.card} />
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <IconSymbol name="camera.fill" size={16} color={colors.card} />
            </TouchableOpacity>
          </View>
          <Text style={styles.driverName}>John Driver</Text>
          <Text style={styles.driverId}>Driver ID: DRV-12345</Text>
          <View style={styles.ratingContainer}>
            <IconSymbol name="star.fill" size={16} color={colors.warning} />
            <Text style={styles.ratingText}>{statistics.rating.toFixed(1)}</Text>
            <Text style={styles.ratingCount}>(234 ratings)</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <IconSymbol name={stat.icon} size={24} color={colors.primary} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item.route)}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <IconSymbol name={item.icon} size={20} color={colors.primary} />
                </View>
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <IconSymbol name="arrow.right.square.fill" size={20} color={colors.error} />
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 1.0.0</Text>
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: colors.card,
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.card,
  },
  driverName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  driverId: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 16,
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
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  menuSection: {
    backgroundColor: colors.card,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    paddingVertical: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
    marginLeft: 8,
  },
  versionText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
});
