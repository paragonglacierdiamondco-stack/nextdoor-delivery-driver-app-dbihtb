
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  TextInput,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

export default function ScanPackageScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [manualEntry, setManualEntry] = useState(false);
  const [packageNumber, setPackageNumber] = useState('');
  const [flashEnabled, setFlashEnabled] = useState(false);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    console.log(`Scanned ${type}: ${data}`);
    Alert.alert(
      'Package Scanned',
      `Package Number: ${data}`,
      [
        {
          text: 'Scan Another',
          onPress: () => setScanned(false),
        },
        {
          text: 'Continue',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const handleManualSubmit = () => {
    if (packageNumber.trim()) {
      Alert.alert(
        'Package Added',
        `Package Number: ${packageNumber}`,
        [
          {
            text: 'Add Another',
            onPress: () => setPackageNumber(''),
          },
          {
            text: 'Done',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      Alert.alert('Error', 'Please enter a package number');
    }
  };

  if (!permission) {
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <Stack.Screen options={{ title: 'Scan Package' }} />
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Loading camera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <Stack.Screen options={{ title: 'Scan Package' }} />
        <View style={styles.permissionContainer}>
          <IconSymbol name="camera.fill" size={64} color={colors.textSecondary} />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need access to your camera to scan package barcodes and QR codes.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
            activeOpacity={0.8}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.manualEntryButton}
            onPress={() => setManualEntry(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.manualEntryButtonText}>Enter Manually</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (manualEntry) {
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <Stack.Screen
          options={{
            title: 'Manual Entry',
            headerLeft: () => (
              <TouchableOpacity onPress={() => setManualEntry(false)}>
                <IconSymbol name="chevron.left" size={24} color={colors.primary} />
              </TouchableOpacity>
            ),
          }}
        />
        <View style={styles.manualContainer}>
          <IconSymbol name="keyboard" size={64} color={colors.primary} />
          <Text style={styles.manualTitle}>Enter Package Number</Text>
          <Text style={styles.manualSubtitle}>
            Type or paste the package tracking number
          </Text>
          <TextInput
            style={styles.manualInput}
            placeholder="PKG-12345"
            placeholderTextColor={colors.textSecondary}
            value={packageNumber}
            onChangeText={setPackageNumber}
            autoCapitalize="characters"
            autoCorrect={false}
            autoFocus
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleManualSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>Add Package</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setManualEntry(false)}
            activeOpacity={0.8}
          >
            <IconSymbol name="qrcode.viewfinder" size={20} color={colors.primary} />
            <Text style={styles.switchButtonText}>Scan Instead</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.cameraContainer}>
      <Stack.Screen
        options={{
          title: 'Scan Package',
          headerTransparent: true,
          headerTintColor: colors.card,
        }}
      />
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'ean13', 'code128', 'code39'],
        }}
        enableTorch={flashEnabled}
      >
        <View style={styles.overlay}>
          <View style={styles.topOverlay}>
            <Text style={styles.instructionText}>
              Position the barcode or QR code within the frame
            </Text>
          </View>

          <View style={styles.middleOverlay}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
          </View>

          <View style={styles.bottomOverlay}>
            <TouchableOpacity
              style={styles.flashButton}
              onPress={() => setFlashEnabled(!flashEnabled)}
              activeOpacity={0.8}
            >
              <IconSymbol
                name={flashEnabled ? 'bolt.fill' : 'bolt.slash.fill'}
                size={24}
                color={colors.card}
              />
              <Text style={styles.flashButtonText}>
                {flashEnabled ? 'Flash On' : 'Flash Off'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.manualButton}
              onPress={() => setManualEntry(true)}
              activeOpacity={0.8}
            >
              <IconSymbol name="keyboard" size={24} color={colors.card} />
              <Text style={styles.manualButtonText}>Manual Entry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    backgroundColor: colors.text,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  instructionText: {
    fontSize: 16,
    color: colors.card,
    textAlign: 'center',
    fontWeight: '500',
  },
  middleOverlay: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  scanFrame: {
    width: 280,
    height: 280,
    alignSelf: 'center',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: colors.primary,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  flashButton: {
    alignItems: 'center',
  },
  flashButtonText: {
    fontSize: 12,
    color: colors.card,
    marginTop: 8,
    fontWeight: '500',
  },
  manualButton: {
    alignItems: 'center',
  },
  manualButtonText: {
    fontSize: 12,
    color: colors.card,
    marginTop: 8,
    fontWeight: '500',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: colors.background,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 16,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.card,
  },
  manualEntryButton: {
    paddingVertical: 12,
  },
  manualEntryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  manualContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: colors.background,
  },
  manualTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 24,
    marginBottom: 8,
  },
  manualSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  manualInput: {
    width: '100%',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 24,
  },
  submitButton: {
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.card,
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
});
