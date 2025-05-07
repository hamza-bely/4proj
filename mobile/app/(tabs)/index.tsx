import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  FlatList,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useLocation } from '@/contexts/LocationContext';
import { useAuth } from '@/contexts/AuthContext';
import { api, tomtomApi, reverseGeocode } from '@/services/api';
import LoadingIndicator from '@/components/LoadingIndicator';
import Button from '@/components/Button';
import ReportMarker from '@/components/ReportMarker';
import { AlertCircle, Navigation, X, ThumbsUp, ThumbsDown, ChevronUp, ChevronDown } from 'lucide-react-native';
import RouteModal from '@/components/RouteModal';


export default function MapScreen() {
  const { state: locationState, getCurrentLocation } = useLocation();
  const { state: authState } = useAuth();
  const mapRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('ACCIDENTS');
  const [reportLocation, setReportLocation] = useState(null);
  const [reportAddress, setReportAddress] = useState('');
  const [routeError, setRouteError] = useState(null);

  const [showRouteModal, setShowRouteModal] = useState(false);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [startAddress, setStartAddress] = useState('');

  const [showWebViewMap, setShowWebViewMap] = useState(false);

  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeInstructions, setRouteInstructions] = useState([]);
  const [routeSummary, setRouteSummary] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);

  const zoomToRoute = (coordinates) => {
    if (!coordinates || coordinates.length === 0 || !mapRef.current) return;

    // Calculer les limites de la carte
    let minLat = coordinates[0].latitude;
    let maxLat = coordinates[0].latitude;
    let minLng = coordinates[0].longitude;
    let maxLng = coordinates[0].longitude;

    coordinates.forEach(coord => {
      minLat = Math.min(minLat, coord.latitude);
      maxLat = Math.max(maxLat, coord.latitude);
      minLng = Math.min(minLng, coord.longitude);
      maxLng = Math.max(maxLng, coord.longitude);
    });

    // Ajouter un peu de marge
    const latDelta = (maxLat - minLat) * 1.2;
    const lngDelta = (maxLng - minLng) * 1.2;

    mapRef.current.animateToRegion({
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max(latDelta, 0.01),
      longitudeDelta: Math.max(lngDelta, 0.01),
    }, 1000);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReports();
      initializeLocation();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const initializeLocation = async () => {
    try {
      const location = await getCurrentLocation();
      if (location) {
        setStartLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        try {
          const result = await reverseGeocode(location.coords.latitude, location.coords.longitude);
          if (result.addresses && result.addresses.length > 0) {
            setStartAddress(result.addresses[0].address.freeformAddress);
          }
        } catch (error) {
          console.error('Error reverse geocoding:', error);
        }
      }
    } catch (error) {
      console.error('Error initializing location:', error);
    }
  };

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching reports from:', `${api.defaults.baseURL}/api/reports/get-all`);

      const response = await api.get('/api/reports/get-all');
      console.log('Reports API response:', response);

      if (response.data && response.data.data) {
        setReports(response.data.data);
      } else {
        console.warn('No reports data found in response');
        setReports([]);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      Alert.alert('Erreur', `Impossible de charger les signalements: ${error.message}`);
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportMarkerPress = (id) => {
    const report = reports.find(r => r.id === id);
    if (report) {
      setSelectedReport(report);
    }
  };

  const handleAddReport = async () => {
    try {
      if (!reportLocation) {
        if (Platform.OS !== 'web' && locationState.location) {
          setReportLocation({
            latitude: locationState.location.coords.latitude,
            longitude: locationState.location.coords.longitude,
          });

          try {
            const result = await reverseGeocode(
              locationState.location.coords.latitude,
              locationState.location.coords.longitude
            );
            if (result.addresses && result.addresses.length > 0) {
              setReportAddress(result.addresses[0].address.freeformAddress);
            }
          } catch (error) {
            console.error('Error reverse geocoding:', error);
          }
        } else {
          Alert.alert('Erreur', 'Veuillez sélectionner un emplacement sur la carte');
          return;
        }
      }

      setIsLoading(true);

      const location = reportLocation || {
        latitude: locationState.location?.coords.latitude,
        longitude: locationState.location?.coords.longitude
      };

      const payload = {
        type: reportType,
        latitude: location.latitude,
        longitude: location.longitude,
        status: 'AVAILABLE',
        address: reportAddress || 'Adresse inconnue',
      };

      const response = await api.post('/api/reports/create', payload);
      console.log('Report creation response:', response);

      setShowReportModal(false);
      setReportType('ACCIDENTS');
      setReportLocation(null);
      setReportAddress('');

      Alert.alert('Succès', 'Signalement ajouté avec succès');
      fetchReports();
    } catch (error) {
      console.error('Error adding report:', error);
      Alert.alert('Erreur', `Impossible d'ajouter le signalement: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikeReport = async (id) => {
    try {
      console.log('Liking report ID:', id);
      await api.post(`/api/reports/${id}/like`);
      fetchReports();
    } catch (error) {
      console.error('Error liking report:', error);
      Alert.alert('Erreur', 'Impossible de liker le signalement');
    }
  };

  const handleDislikeReport = async (id) => {
    try {
      console.log('Disliking report ID:', id);
      await api.post(`/api/reports/${id}/dislike`);
      fetchReports();
    } catch (error) {
      console.error('Error disliking report:', error);
      Alert.alert('Erreur', 'Impossible de disliker le signalement');
    }
  };

  const handleMapPress = async (event) => {
    if (showReportModal) {
      const { coordinate } = event.nativeEvent;
      console.log('Selected coordinate for report:', coordinate);
      setReportLocation(coordinate);

      try {
        const result = await reverseGeocode(coordinate.latitude, coordinate.longitude);
        if (result.addresses && result.addresses.length > 0) {
          setReportAddress(result.addresses[0].address.freeformAddress);
        }
      } catch (error) {
        console.error('Error reverse geocoding:', error);
      }
    }
  };

  const handleRouteInstructions = (instructions, summary) => {
    console.log("Received instructions:", instructions);
    setRouteInstructions(instructions);
    setRouteSummary(summary);
    setShowInstructions(true);

    if (routeCoordinates && routeCoordinates.length > 0) {
      zoomToRoute(routeCoordinates);
    }
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} h ${minutes} min`;
    } else {
      return `${minutes} min`;
    }
  };

  const formatDistance = (meters) => {
    if (meters < 1000) {
      return `${meters} m`;
    } else {
      return `${(meters / 1000).toFixed(1)} km`;
    }
  };

  const renderDebugInfo = () => {
    if (__DEV__) {
      return (
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>
            Current: {locationState.location ?
            `${locationState.location.coords.latitude.toFixed(6)}, ${locationState.location.coords.longitude.toFixed(6)}` :
            'Not available'}
          </Text>
          <Text style={styles.debugText}>
            Start: {startLocation ?
            `${startLocation.latitude.toFixed(6)}, ${startLocation.longitude.toFixed(6)}` :
            'Not set'}
          </Text>
          <Text style={styles.debugText}>
            End: {endLocation ?
            `${endLocation.latitude.toFixed(6)}, ${endLocation.longitude.toFixed(6)}` :
            'Not set'}
          </Text>
          <Text style={styles.debugText}>
            Route: {routeCoordinates.length} points
          </Text>
        </View>
      );
    }
    return null;
  };

  if (locationState.loading || isLoading) {
    return <LoadingIndicator message="Chargement de la carte..." />;
  }
  

  return (
    <View style={styles.container}>
      {showWebViewMap ? (
        <View style={styles.errorNotification}>
          <Text style={styles.errorNotificationText}>{routeError}</Text>
          <TouchableOpacity
            style={styles.errorNotificationButton}
            onPress={() => setRouteError(null)}
          >
            <X size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: locationState.location?.coords.latitude || 48.8566,
              longitude: locationState.location?.coords.longitude || 2.3522,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={handleMapPress}
          >
            {locationState.location && (
              <Marker
                coordinate={{
                  latitude: locationState.location.coords.latitude,
                  longitude: locationState.location.coords.longitude,
                }}
                title="Ma position"
                pinColor="#3498db"
              />
            )}

            {reports.map((report) => (
              <ReportMarker
                key={report.id}
                id={report.id}
                coordinate={{
                  latitude: report.latitude,
                  longitude: report.longitude,
                }}
                type={report.type}
                onPress={handleReportMarkerPress}
              />
            ))}

            {reportLocation && showReportModal && (
              <Marker
                coordinate={reportLocation}
                title="Emplacement du signalement"
                pinColor="#e74c3c"
              />
            )}

            {startLocation && (
              <Marker
                coordinate={startLocation}
                title="Départ"
                pinColor="#27ae60"
              />
            )}

            {endLocation && (
              <Marker
                coordinate={endLocation}
                title="Arrivée"
                pinColor="#e74c3c"
              />
            )}

            {routeCoordinates.length > 0 && (
              <Polyline
                coordinates={routeCoordinates}
                strokeWidth={5}
                strokeColor="#3498db"
                lineCap="round"
                lineJoin="round"
              />
            )}
          </MapView>


            <TouchableOpacity
              style={styles.showInstructionsButton}
              onPress={() => setShowInstructions(true)}
            >
              <ChevronUp size={24} color="white" />
              <Text style={styles.showInstructionsText}>Voir les instructions</Text>
            </TouchableOpacity>



          {showInstructions && routeInstructions && routeInstructions.length > 0 && (
            <View style={styles.instructionsPanel}>
              <View style={styles.instructionsHeader}>
                <Text style={styles.instructionsTitle}>Instructions de conduite</Text>
                <TouchableOpacity
                  style={styles.instructionsCloseButton}
                  onPress={() => setShowInstructions(false)}
                >
                  <X size={20} color="#333" />
                </TouchableOpacity>
              </View>

              {/* Résumé de l'itinéraire */}
              {routeSummary && (
                <View style={styles.routeSummary}>
                  <Text style={styles.routeSummaryText}>
                    Distance: {formatDistance(routeSummary.lengthInMeters)} |
                    Durée: {formatDuration(routeSummary.travelTimeInSeconds)}
                    {routeSummary.trafficDelayInSeconds > 60 &&
                      ` (dont ${formatDuration(routeSummary.trafficDelayInSeconds)} de retard dû au trafic)`}
                  </Text>
                </View>
              )}

              <FlatList
                data={routeInstructions}
                keyExtractor={(item) => `instruction-${item.id}`}
                renderItem={({ item, index }) => (
                  <View style={styles.instructionItem}>
                    <View style={styles.instructionNumber}>
                      <Text style={styles.instructionNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.instructionText}>
                      {item.message}
                      {item.roadName ? ` (${item.roadName})` : ''}
                    </Text>
                  </View>
                )}
                style={styles.instructionsList}
              />
            </View>
          )}


          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.reportButton]}
              onPress={() => {
                setReportType('ACCIDENTS');
                if (locationState.location) {
                  setReportLocation({
                    latitude: locationState.location.coords.latitude,
                    longitude: locationState.location.coords.longitude,
                  });

                  reverseGeocode(
                    locationState.location.coords.latitude,
                    locationState.location.coords.longitude
                  ).then(result => {
                    if (result.addresses && result.addresses.length > 0) {
                      setReportAddress(result.addresses[0].address.freeformAddress);
                    }
                  }).catch(err => console.error('Error geocoding for report:', err));
                }
                setShowReportModal(true);
              }}
            >
              <AlertCircle size={24} color="white" />
              <Text style={styles.actionText}>Signaler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.routeButton]}
              onPress={() => {
                if (locationState.location && !startLocation) {
                  setStartLocation({
                    latitude: locationState.location.coords.latitude,
                    longitude: locationState.location.coords.longitude,
                  });

                  reverseGeocode(
                    locationState.location.coords.latitude,
                    locationState.location.coords.longitude
                  ).then(result => {
                    if (result.addresses && result.addresses.length > 0) {
                      setStartAddress(result.addresses[0].address.freeformAddress);
                    }
                  }).catch(err => console.error('Error geocoding for route start:', err));
                }
                setShowRouteModal(true);
              }}
            >
              <Navigation size={24} color="white" />
              <Text style={styles.actionText}>Itinéraire</Text>
            </TouchableOpacity>
          </View>
          {selectedReport && (
            <View style={styles.reportInfoContainer}>
              <View style={styles.reportInfoHeader}>
                <Text style={styles.reportInfoTitle}>
                  {selectedReport.type === 'ACCIDENTS' && 'Accident'}
                  {selectedReport.type === 'TRAFFIC' && 'Trafic'}
                  {selectedReport.type === 'ROADS_CLOSED' && 'Route fermée'}
                  {selectedReport.type === 'POLICE_CHECKS' && 'Contrôle police'}
                  {selectedReport.type === 'OBSTACLES' && 'Obstacle'}
                </Text>
                <TouchableOpacity
                  onPress={() => setSelectedReport(null)}
                >
                  <X size={20} color="#333" />
                </TouchableOpacity>
              </View>

              <Text style={styles.reportInfoAddress}>{selectedReport.address}</Text>

              <View style={styles.reportActions}>
                <TouchableOpacity
                  style={styles.reportActionButton}
                  onPress={() => handleLikeReport(selectedReport.id)}
                >
                  <ThumbsUp size={18} color="#3498db" />
                  <Text style={styles.reportActionText}>{selectedReport.likeCount || 0}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.reportActionButton}
                  onPress={() => handleDislikeReport(selectedReport.id)}
                >
                  <ThumbsDown size={18} color="#e74c3c" />
                  <Text style={styles.reportActionText}>{selectedReport.dislikeCount || 0}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {renderDebugInfo()}
        </>
      )}
      <Modal
        visible={showReportModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowReportModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ajouter un signalement</Text>
              <TouchableOpacity
                onPress={() => setShowReportModal(false)}
              >
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Type de signalement</Text>
            <View style={styles.reportTypeContainer}>
              {['ACCIDENTS', 'TRAFFIC', 'ROADS_CLOSED', 'POLICE_CHECKS', 'OBSTACLES'].map((type) => (
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
                    {type === 'ACCIDENTS' && 'Accident'}
                    {type === 'TRAFFIC' && 'Trafic'}
                    {type === 'ROADS_CLOSED' && 'Route fermée'}
                    {type === 'POLICE_CHECKS' && 'Police'}
                    {type === 'OBSTACLES' && 'Obstacle'}
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
              <Button
                title="Annuler"
                variant="outline"
                onPress={() => setShowReportModal(false)}
                style={styles.modalButton}
              />
              <Button
                title="Ajouter"
                onPress={handleAddReport}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Route Planning Modal */}
      <Modal
        visible={showRouteModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRouteModal(false)}
      >
        <View style={styles.modalContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ width: '100%' }}
          >
            <ScrollView>
              <RouteModal
                setShowRouteModal={setShowRouteModal}
                tomtomApi={tomtomApi}
                api={api}
                authState={authState}
                setShowWebViewMap={setShowWebViewMap}
                mapRef={mapRef}
                setRouteCoordinates={setRouteCoordinates}
                setRouteInstructions={handleRouteInstructions}
                setEndLocation={setEndLocation}
              />
            </ScrollView>


          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}


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
  errorNotification: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  errorNotificationText: {
    color: '#fff',
    flex: 1,
    marginRight: 10,
    fontFamily: 'Inter-Medium',
  },
  errorNotificationButton: {
    padding: 5,
  },
  instructionsPanel: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    maxHeight: '60%',
  },
  instructionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  instructionsCloseButton: {
    padding: 6,
  },
  routeSummary: {
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
  },
  routeSummaryText: {
    fontSize: 14,
    color: '#444',
  },
  instructionsList: {
    marginTop: 8,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  instructionNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#007aff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  instructionNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  showInstructionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007aff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    alignSelf: 'center',
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  showInstructionsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});