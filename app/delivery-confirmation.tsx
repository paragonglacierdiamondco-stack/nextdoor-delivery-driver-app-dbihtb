
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useApp } from '@/contexts/AppContext';
import * as ImagePicker from 'expo-image-picker';

export default function DeliveryConfirmationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { deliveries, updateDelivery } = useApp();
  const [proofPhoto, setProofPhoto] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('front-door');

  const delivery = deliveries.find(d => d.id === id);

  const deliveryLocations = [
    { id: 'front-door', label: 'Front Door', icon: 'door.left.hand.open' },
    { id: 'back-door', label: 'Back Door', icon: 'door.right.hand.open' },
    { id: 'mailbox', label: 'Mailbox', icon: 'envelope.fill' },
    { id: 'reception', label: 'Reception', icon: 'building.2.fill' },
    { id: 'handed-to-customer', label: 'Handed to Customer', icon: 'person.fill' },
    { id: 'other', label: 'Other Location', icon: 'location.fill' },
  ];

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is required to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProofPhoto(result.assets[0].uri);
        console.log('Photo captured:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handleConfirmDelivery = async () => {
    if (!delivery) {
      Alert.alert('Error', 'Delivery not found');
      return;
    }

    if (!proofPhoto) {
      Alert.alert(
        'Photo Required',
        'Please take a photo as proof of delivery before confirming.',
        [{ text: 'OK' }]
      );
      return;
    }

    await updateDelivery(delivery.id, {
      status: 'delivered',
      completedAt: new Date().toISOString(),
      proofPhoto: proofPhoto,
    });

    Alert.alert(
      'Delivery Confirmed',
      `Package ${delivery.packageNumber} has been successfully delivered!`,
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  if (!delivery) {
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <Stack.Screen options={{ title: 'Delivery Confirmation' }} />
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle.fill" size={64} color={colors.error} />
          <Text style={styles.errorText}>Delivery not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Stack.Screen
        options={{
          title: 'Confirm Delivery',
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
      >
        <View style={styles.deliveryInfo}>
          <Text style={styles.packageNumber}>{delivery.packageNumber}</Text>
          <Text style={styles.recipient}>{delivery.recipient}</Text>
          <Text style={styles.address}>{delivery.address}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Location</Text>
          <View style={styles.locationsGrid}>
            {deliveryLocations.map((location) => (
              <TouchableOpacity
                key={location.id}
                style={[
                  styles.locationCard,
                  selectedLocation === location.id && styles.locationCardSelected,
                ]}
                onPress={() => setSelectedLocation(location.id)}
                activeOpacity={0.7}
              >
                <IconSymbol
                  name={location.icon}
                  size={24}
                  color={selectedLocation === location.id ? colors.primary : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.locationLabel,
                    selectedLocation === location.id && styles.locationLabelSelected,
                  ]}
                >
                  {location.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Proof of Delivery</Text>
          {proofPhoto ? (
            <View style={styles.photoContainer}>
              <Image source={{ uri: proofPhoto }} style={styles.photo} />
              <TouchableOpacity
                style={styles.retakeButton}
                onPress={takePhoto}
                activeOpacity={0.8}
              >
                <IconSymbol name="camera.fill" size={20} color={colors.primary} />
                <Text style={styles.retakeButtonText}>Retake Photo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.photoButton}
              onPress={takePhoto}
              activeOpacity={0.8}
            >
              <IconSymbol name="camera.fill" size={48} color={colors.primary} />
              <Text style={styles.photoButtonTitle}>Take Photo</Text>
              <Text style={styles.photoButtonSubtitle}>
                Photo of delivered package is required
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.confirmButton,
            !proofPhoto && styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirmDelivery}
          activeOpacity={0.8}
          disabled={!proofPhoto}
        >
          <IconSymbol name="checkmark.circle.fill" size={24} color={colors.card} />
          <Text style={styles.confirmButtonText}>Confirm Delivery</Text>
        </TouchableOpacity>
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
  deliveryInfo: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  packageNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  recipient: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  locationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  locationCard: {
    width: '31%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: '1%',
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  locationCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  locationLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  locationLabelSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  photoContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  photo: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: 12,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retakeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
  photoButton: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  photoButtonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 4,
  },
  photoButtonSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  confirmButtonDisabled: {
    backgroundColor: colors.textSecondary,
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.card,
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.card,
  },
});
