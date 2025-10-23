
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useApp } from '@/contexts/AppContext';

type IssueType = 'address-not-found' | 'customer-unavailable' | 'damaged-package' | 'access-issue' | 'other';

export default function ReportIssueScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { reportIssue, deliveries, updateDelivery } = useApp();
  const [selectedIssue, setSelectedIssue] = useState<IssueType | null>(null);
  const [description, setDescription] = useState('');

  const delivery = id ? deliveries.find(d => d.id === id) : null;

  const issueTypes = [
    {
      type: 'address-not-found' as IssueType,
      title: 'Address Not Found',
      icon: 'location.slash.fill',
      color: colors.error,
    },
    {
      type: 'customer-unavailable' as IssueType,
      title: 'Customer Unavailable',
      icon: 'person.slash.fill',
      color: colors.warning,
    },
    {
      type: 'damaged-package' as IssueType,
      title: 'Damaged Package',
      icon: 'exclamationmark.triangle.fill',
      color: colors.error,
    },
    {
      type: 'access-issue' as IssueType,
      title: 'Access Issue',
      icon: 'lock.fill',
      color: colors.secondary,
    },
    {
      type: 'other' as IssueType,
      title: 'Other Issue',
      icon: 'ellipsis.circle.fill',
      color: colors.textSecondary,
    },
  ];

  const handleSubmit = async () => {
    if (!selectedIssue) {
      Alert.alert('Error', 'Please select an issue type');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please provide a description');
      return;
    }

    const deliveryId = delivery?.id || 'general';

    await reportIssue({
      deliveryId,
      type: selectedIssue,
      description: description.trim(),
    });

    if (delivery) {
      await updateDelivery(delivery.id, {
        status: 'exception',
        notes: `Issue: ${selectedIssue} - ${description.trim()}`,
      });
    }

    console.log('Issue reported:', { type: selectedIssue, description, deliveryId });
    
    Alert.alert(
      'Issue Reported',
      'Your issue has been logged and support will be notified.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Stack.Screen
        options={{
          title: 'Report Issue',
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
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <IconSymbol name="exclamationmark.triangle.fill" size={48} color={colors.warning} />
          <Text style={styles.headerTitle}>Report Delivery Exception</Text>
          <Text style={styles.headerSubtitle}>
            Select the issue type and provide details
          </Text>
        </View>

        {delivery && (
          <View style={styles.deliveryInfo}>
            <Text style={styles.packageNumber}>{delivery.packageNumber}</Text>
            <Text style={styles.recipient}>{delivery.recipient}</Text>
            <Text style={styles.address}>{delivery.address}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Issue Type</Text>
          {issueTypes.map((issue) => (
            <TouchableOpacity
              key={issue.type}
              style={[
                styles.issueCard,
                selectedIssue === issue.type && styles.issueCardSelected,
              ]}
              onPress={() => setSelectedIssue(issue.type)}
              activeOpacity={0.7}
            >
              <View style={[styles.issueIcon, { backgroundColor: issue.color + '20' }]}>
                <IconSymbol name={issue.icon} size={24} color={issue.color} />
              </View>
              <Text style={styles.issueTitle}>{issue.title}</Text>
              {selectedIssue === issue.type && (
                <IconSymbol name="checkmark.circle.fill" size={24} color={colors.success} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Provide additional details about the issue..."
            placeholderTextColor={colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.photoButton}
            onPress={() => console.log('Take photo')}
            activeOpacity={0.8}
          >
            <IconSymbol name="camera.fill" size={20} color={colors.primary} />
            <Text style={styles.photoButtonText}>Add Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>Submit Report</Text>
          </TouchableOpacity>
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
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  deliveryInfo: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  packageNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  recipient: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  address: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  issueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  issueCardSelected: {
    borderColor: colors.success,
    backgroundColor: colors.success + '10',
  },
  issueIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  issueTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  textArea: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    minHeight: 120,
  },
  actionSection: {
    marginTop: 8,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  photoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.card,
  },
});
