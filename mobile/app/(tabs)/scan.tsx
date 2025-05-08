import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button as RNButton, Alert, Modal, TouchableOpacity, Platform, Image } from 'react-native';
import { router } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useAuth } from '@/contexts/AuthContext';
import { Scan, X } from 'lucide-react-native';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [qrData, setQrData] = useState<any>(null);
  const { state: authState } = useAuth();

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    try {
      const parsed = JSON.parse(data);

      const qrFormatted = {
        startLat: parsed.start?.lat,
        startLng: parsed.start?.lon,
        endLat: parsed.end?.lat,
        endLng: parsed.end?.lon,
        startAddress: parsed.start?.address,
        endAddress: parsed.end?.address,
        distance: `${(parsed.route?.distance / 1000).toFixed(1)} km`,
        duration: `${Math.floor(parsed.route?.duration / 60)} min`,
        fuelCost: `${parsed.route?.fuelCost?.toFixed(2)} €`,
        tollCost: `${parsed.route?.tollCost?.toFixed(2)} €`,
        type: `${parsed.type} €`,
        avoidTolls : `${parsed.avoidTolls} €`
      };

      setQrData(qrFormatted);
      setScanned(true);
      setShowModal(true);
    } catch (error) {
      Alert.alert('QR Code Invalide', 'Format invalide.');
      setScanned(false);
    }
  };

  const handleUseRoute = () => {
    if (qrData && qrData.startLat && qrData.startLng && qrData.endLat && qrData.endLng) {
      router.push({
        pathname: '/(tabs)',
        params: {
          startLat: qrData.startLat,
          startLng: qrData.startLng,
          endLat: qrData.endLat,
          endLng: qrData.endLng,
          startAddress: qrData.startAddress || '',
          endAddress: qrData.endAddress || '',
          type: qrData.type || ''
        },
      });
    }
    setShowModal(false);
    setScanned(false);
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          Nous avons besoin de votre permission pour utiliser la caméra
        </Text>
        <RNButton title="Autoriser la caméra" onPress={requestPermission} />
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Scanner un QR code</Text>
        <View style={styles.webContainer}>
          <Text style={styles.webText}>
            La fonctionnalité de scan QR code est optimisée pour les appareils mobiles.
          </Text>
          <Image 
            source={require('@/assets/images/qr-example.png')}
            style={styles.qrExample}
            resizeMode="contain"
          />
          <Text style={styles.webSubtext}>
            Exemple de QR code contenant des informations d'itinéraire
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scanner un QR code d'itinéraire</Text>
      </View>
      
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}

        >
          <View style={styles.overlay}>
            <View style={styles.scanArea}>
              <Scan size={200} color="rgba(255, 255, 255, 0.5)" />
            </View>
            <Text style={styles.scanText}>Scannez un QR code d'itinéraire</Text>
          </View>
        </CameraView>
      </View>

      {scanned && (
        <View style={styles.scanAgainContainer}>
          <RNButton 
            title="Scanner à nouveau" 
            onPress={() => setScanned(false)} 
          />
        </View>
      )}

      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowModal(false);
          setScanned(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Itinéraire détecté</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowModal(false);
                  setScanned(false);
                }}
              >
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.routeInfoContainer}>
              <Text style={styles.infoLabel}>Départ:</Text>
              <Text style={styles.infoText}>{qrData?.startAddress || 'Position non spécifiée'}</Text>
              
              <Text style={styles.infoLabel}>Destination:</Text>
              <Text style={styles.infoText}>{qrData?.endAddress || 'Position non spécifiée'}</Text>
              
              {qrData?.distance && (
                <>
                  <Text style={styles.infoLabel}>Distance:</Text>
                  <Text style={styles.infoText}>{qrData.distance}</Text>
                </>
              )}
              {qrData?.type && (
                <>
                  <Text style={styles.infoLabel}>Type:</Text>
                  <Text style={styles.infoText}>{qrData.type}</Text>
                </>
              )}

              {qrData?.avoidTolls && (
                <>
                  <Text style={styles.infoLabel}>Peage:</Text>
                  <Text style={styles.infoText}>{qrData.avoidTolls}</Text>
                </>
              )}
              
              {qrData?.duration && (
                <>
                  <Text style={styles.infoLabel}>Durée estimée:</Text>
                  <Text style={styles.infoText}>{qrData.duration}</Text>
                </>
              )}
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => {
                  setShowModal(false);
                  setScanned(false);
                }}
              >
                <Text style={styles.buttonSecondaryText}>Annuler</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={handleUseRoute}
              >
                <Text style={styles.buttonPrimaryText}>Utiliser cet itinéraire</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Inter-Bold',
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanText: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
  },
  scanAgainContainer: {
    padding: 16,
    backgroundColor: 'white',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Inter-Regular',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  modalView: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Inter-Bold',
  },
  routeInfoContainer: {
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginTop: 12,
    marginBottom: 4,
    fontFamily: 'Inter-Medium',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 2,
    marginHorizontal: 4,
    flex: 1,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#3498db',
  },
  buttonSecondary: {
    backgroundColor: '#f1f1f1',
  },
  buttonPrimaryText: {
    color: 'white',
    fontWeight: '600',
    fontFamily: 'Inter-Medium',
  },
  buttonSecondaryText: {
    color: '#333',
    fontWeight: '600',
    fontFamily: 'Inter-Medium',
  },
  webContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#555',
    fontFamily: 'Inter-Regular',
  },
  qrExample: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  webSubtext: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
});