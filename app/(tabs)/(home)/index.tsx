
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { Stack, useRouter, Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

export default function HomeScreen() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Show login screen if not logged in
  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  const stats = [
    { label: 'Today\'s Deliveries', value: '12', icon: 'shippingbox.fill', color: colors.primary },
    { label: 'Completed', value: '8', icon: 'checkmark.circle.fill', color: colors.success },
    { label: 'Pending', value: '4', icon: 'clock.fill', color: colors.warning },
    { label: 'This Week', value: '67', icon: 'chart.bar.fill', color: colors.secondary },
  ];

  const quickActions = [
    {
      title: 'Scan Package',
      description: 'Scan QR code or barcode',
      icon: 'qrcode.viewfinder',
      color: colors.primary,
      route: '/scan-package',
    },
    {
      title: 'Start Delivery',
      description: 'Begin delivery route',
      icon: 'location.fill',
      color: colors.secondary,
      route: '/start-delivery',
    },
    {
      title: 'Report Issue',
      description: 'Log delivery exception',
      icon: 'exclamationmark.triangle.fill',
      color: colors.error,
      route: '/report-issue',
    },
    {
      title: 'View Statistics',
      description: 'Performance metrics',
      icon: 'chart.line.uptrend.xyaxis',
      color: colors.accent,
      route: '/statistics',
    },
  ];

  return (
    <SafeAreaView style={commonStyles.safeArea} edges={['top']}>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'My Nextdoor Delivery',
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
        {/* Header with Logo */}
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://prod-finalquest-user-projects-storage-bucket-aws.s3.amazonaws.com/user-projects/801f20cc-0ecd-49c0-bfc6-b9e915f22ae8/assets/images/40af5e0c-5673-43b8-9473-6b63d147c92e.jpeg?AWSAccessKeyId=AKIAVRUVRKQJC5DISQ4Q&Signature=SDhsLGNMK%2BjiztZeJuN4kVz50lQ%3D&Expires=1761269261' }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>Welcome back, Driver!</Text>
          <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                <IconSymbol name={stat.icon} size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={() => router.push(action.route as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                <IconSymbol name={action.icon} size={28} color={action.color} />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDescription}>{action.description}</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: colors.success }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Package #12345 delivered</Text>
                <Text style={styles.activityTime}>10 minutes ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: colors.primary }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Package #12344 picked up</Text>
                <Text style={styles.activityTime}>25 minutes ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: colors.success }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Package #12343 delivered</Text>
                <Text style={styles.activityTime}>1 hour ago</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.loginContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.loginHeader}>
          <Image
            source={{ uri: 'https://prod-finalquest-user-projects-storage-bucket-aws.s3.amazonaws.com/user-projects/801f20cc-0ecd-49c0-bfc6-b9e915f22ae8/assets/images/40af5e0c-5673-43b8-9473-6b63d147c92e.jpeg?AWSAccessKeyId=AKIAVRUVRKQJC5DISQ4Q&Signature=SDhsLGNMK%2BjiztZeJuN4kVz50lQ%3D&Expires=1761269261' }}
            style={styles.loginLogo}
            resizeMode="contain"
          />
          <Text style={styles.loginTitle}>My Nextdoor Delivery</Text>
          <Text style={styles.loginSubtitle}>Driver Portal</Text>
        </View>

        <View style={styles.loginForm}>
          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.inputContainer}>
            <IconSymbol name="envelope.fill" size={20} color={colors.textSecondary} />
            <Text
              style={styles.input}
              onPress={() => console.log('Email input focused')}
            >
              {email || 'driver@nextdoordelivery.com'}
            </Text>
          </View>

          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputContainer}>
            <IconSymbol name="lock.fill" size={20} color={colors.textSecondary} />
            <Text
              style={styles.input}
              onPress={() => console.log('Password input focused')}
            >
              ••••••••
            </Text>
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={onLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.biometricButton}
            onPress={onLogin}
            activeOpacity={0.8}
          >
            <IconSymbol name="faceid" size={24} color={colors.primary} />
            <Text style={styles.biometricButtonText}>Sign in with Face ID</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.loginFooter}>
          <Text style={styles.footerText}>
            Need help? Contact support
          </Text>
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
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 24,
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
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  activityCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  // Login Screen Styles
  loginContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  loginHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  loginLogo: {
    width: 150,
    height: 150,
    marginBottom: 24,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  loginForm: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.card,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginHorizontal: 16,
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
  },
  biometricButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 12,
  },
  loginFooter: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
