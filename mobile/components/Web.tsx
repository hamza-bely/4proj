// components/MapWithModals.tsx
import React, { RefObject } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import { WebView } from 'react-native-webview';
import { X, MapPin, Search } from 'lucide-react-native';
import LoadingIndicator from './LoadingIndicator';
import Button from '@/components/Button';

// Définition des types pour les props
type ReportType = 'ACCIDENTS' | 'TRAFFIC' | 'ROADS_CLOSED' | 'POLICE_CHECKS' | 'OBSTACLES';
type RouteMode = 'Rapide' | 'Court';

interface MapWithModalsProps {
  showWebViewMap: boolean;
  setShowWebViewMap: (show: boolean) => void;
  webViewUrl: string;
  webViewRef: RefObject<WebView>;
  showReportModal: boolean;
  setShowReportModal: (show: boolean) => void;
  reportType: ReportType;
  setReportType: (type: ReportType) => void;
  reportAddress: string;
  setReportAddress: (address: string) => void;
  handleAddReport: () => void;
  showRouteModal: boolean;
  setShowRouteModal: (show: boolean) => void;
  startAddress: string;
  setStartAddress: (address: string) => void;
  handleStartLocationSelect: () => void;
  endAddress: string;
  setEndAddress: (address: string) => void;
  handleSearchEndLocation: () => void;
  routeMode: RouteMode;
  setRouteMode: (mode: RouteMode) => void;
  avoidTolls: boolean;
  setAvoidTolls: (avoid: boolean) => void;
  calculateRoute: () => void;
}

const MapWithModals: React.FC<MapWithModalsProps> = ({
                                                       showWebViewMap,
                                                       setShowWebViewMap,
                                                       webViewUrl,
                                                       webViewRef,
                                                       showReportModal,
                                                       setShowReportModal,
                                                       reportType,
                                                       setReportType,
                                                       reportAddress,
                                                       setReportAddress,
                                                       handleAddReport,
                                                       showRouteModal,
                                                       setShowRouteModal,
                                                       startAddress,
                                                       setStartAddress,
                                                       handleStartLocationSelect,
                                                       endAddress,
                                                       setEndAddress,
                                                       handleSearchEndLocation,
                                                       routeMode,
                                                       setRouteMode,
                                                       avoidTolls,
                                                       setAvoidTolls,
                                                       calculateRoute,
                                                     }) => {
  // Mapping pour les noms d'affichage des types de signalement
  const reportTypeDisplayNames: Record<ReportType, string> = {
    ACCIDENTS: 'Accident',
    TRAFFIC: 'Trafic',
    ROADS_CLOSED: 'Route fermée',
    POLICE_CHECKS: 'Police',
    OBSTACLES: 'Obstacle',
  };

  return (
    <View style={styles.container}>
      {showWebViewMap && (
        <View style={styles.webViewContainer}>
          <View style={styles.webViewHeader}>
            <Text style={styles.webViewTitle}>Itinéraire</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowWebViewMap(false)}
            >
              <X size={24} color="#333" />
            </TouchableOpacity>
          </View>
          {Platform.OS === 'web' ? (
            <iframe
              src={webViewUrl}
              style={{
                width: '100%',
                height: '90%',
                border: 'none',
              }}
              allow="geolocation"
            />
          ) : (
            <WebView
              ref={webViewRef}
              source={{ uri: webViewUrl }}
              style={styles.webView}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              geolocationEnabled={true}
              onError={(event) => {
                console.error('WebView error: ', event.nativeEvent);
                Alert.alert('Erreur', 'Impossible de charger la carte.');
              }}
              onHttpError={(event) => {
                console.error('WebView HTTP error: ', event.nativeEvent);
              }}
              renderLoading={() => <LoadingIndicator message="Chargement..." />}
              startInLoadingState={true}
            />
          )}
        </View>
      )}

      {/* Modal signalement */}
      <Modal
        visible={showReportModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowReportModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ajouter un signalement</Text>
              <TouchableOpacity onPress={() => setShowReportModal(false)}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Type de signalement</Text>
            <View style={styles.reportTypeContainer}>
              {(['ACCIDENTS', 'TRAFFIC', 'ROADS_CLOSED', 'POLICE_CHECKS', 'OBSTACLES'] as ReportType[]).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.reportTypeButton,
                    reportType === type && styles.reportTypeButtonActive,
                  ]}
                  onPress={() => setReportType(type)}
                >
                  <Text
                    style={[
                      styles.reportTypeText,
                      reportType === type && styles.reportTypeTextActive,
                    ]}
                  >
                    {reportTypeDisplayNames[type]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Adresse</Text>
            <TextInput
              style={styles.input}
              value={reportAddress}
              onChangeText={setReportAddress}
              placeholder="Adresse du signalement"
            />

            <View style={styles.modalActions}>
              <Button title="Annuler" variant="outline" onPress={() => setShowReportModal(false)} />
              <Button title="Ajouter" onPress={handleAddReport} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal itinéraire */}
      <Modal
        visible={showRouteModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowRouteModal(false)}
      >
        <View style={styles.modalContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ width: '100%' }}
          >
            <ScrollView>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Planifier un itinéraire</Text>
                  <TouchableOpacity onPress={() => setShowRouteModal(false)}>
                    <X size={24} color="#333" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.inputLabel}>Point de départ</Text>
                <View style={styles.locationInputContainer}>
                  <TextInput
                    style={styles.locationInput}
                    value={startAddress}
                    onChangeText={setStartAddress}
                    placeholder="Adresse de départ"
                  />
                  <TouchableOpacity style={styles.locationButton} onPress={handleStartLocationSelect}>
                    <MapPin size={20} color="#3498db" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.inputLabel}>Destination</Text>
                <View style={styles.locationInputContainer}>
                  <TextInput
                    style={styles.locationInput}
                    value={endAddress}
                    onChangeText={setEndAddress}
                    placeholder="Adresse de destination"
                  />
                  <TouchableOpacity style={styles.locationButton} onPress={handleSearchEndLocation}>
                    <Search size={20} color="#3498db" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.inputLabel}>Mode de trajet</Text>
                <View style={styles.optionsContainer}>
                  {(['Rapide', 'Court'] as RouteMode[]).map((mode) => (
                    <TouchableOpacity
                      key={mode}
                      style={[styles.optionButton, routeMode === mode && styles.optionButtonActive]}
                      onPress={() => setRouteMode(mode)}
                    >
                      <Text style={[styles.optionText, routeMode === mode && styles.optionTextActive]}>
                        {mode === 'Rapide' ? 'Le plus rapide' : 'Le plus court'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.tollOptionContainer}>
                  <Text style={styles.inputLabel}>Options</Text>
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => setAvoidTolls(!avoidTolls)}
                  >
                    <View style={[styles.checkbox, avoidTolls && styles.checkboxActive]}>
                      {avoidTolls && <View style={styles.checkboxInner} />}
                    </View>
                    <Text style={styles.checkboxLabel}>Éviter les péages</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.modalActions}>
                  <Button title="Annuler" variant="outline" onPress={() => setShowRouteModal(false)} />
                  <Button title="Calculer" onPress={calculateRoute} />
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
};

export default MapWithModals;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 24,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  reportButton: {
    backgroundColor: '#e74c3c',
  },
  routeButton: {
    backgroundColor: '#3498db',
  },
  actionText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
  inputLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
    fontWeight: '600',
    fontFamily: 'Inter-Medium',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    fontFamily: 'Inter-Regular',
  },
  reportTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  reportTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
    marginRight: 8,
    marginBottom: 8,
  },
  reportTypeButtonActive: {
    backgroundColor: '#3498db',
  },
  reportTypeText: {
    color: '#555',
    fontFamily: 'Inter-Medium',
  },
  reportTypeTextActive: {
    color: 'white',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  locationInputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  locationInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    fontFamily: 'Inter-Regular',
  },
  locationButton: {
    padding: 12,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f1f1f1',
    marginRight: 8,
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: '#3498db',
  },
  optionText: {
    color: '#555',
    fontFamily: 'Inter-Medium',
  },
  optionTextActive: {
    color: 'white',
  },
  tollOptionContainer: {
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#3498db',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#3498db',
  },
  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: 'white',
    borderRadius: 2,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Inter-Regular',
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  webView: {
    flex: 1,
  },
  webViewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  webViewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Inter-Bold',
  },
  closeButton: {
    padding: 8,
  },
  reportInfoContainer: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  reportInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Inter-Bold',
  },
  reportInfoAddress: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
    fontFamily: 'Inter-Regular',
  },
  reportActions: {
    flexDirection: 'row',
  },
  reportActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  reportActionText: {
    marginLeft: 4,
    color: '#555',
    fontFamily: 'Inter-Regular',
  },
});