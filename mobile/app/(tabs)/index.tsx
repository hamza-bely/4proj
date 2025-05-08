import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
  Platform,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import MapView, { Callout, Marker, Polyline } from 'react-native-maps';
import { useLocation } from '@/contexts/LocationContext';
import { useAuth } from '@/contexts/AuthContext';
import { api, tomtomApi, reverseGeocode } from '@/services/api';
import LoadingIndicator from '@/components/LoadingIndicator';
import Button from '@/components/Button';
import ReportMarker from '@/components/ReportMarker';
import {
  AlertCircle,
  Navigation,
  X,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Trash2,
  Pencil
} from 'lucide-react-native';
import RouteModal from '@/components/RouteModal';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

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

  const [showRouteModal, setShowRouteModal] = useState(false);
  const [startLocation, setStartLocation] = useState(null);
  const [startAddress, setStartAddress] = useState('');
  const [destination, setDestination] = useState(null);
  const [destinationAddress, setDestinationAddress] = useState('');

  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeInstructions, setRouteInstructions] = useState([]);
  const [routeSummary, setRouteSummary] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [geoEnabled, setGeoEnabled] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const params = useLocalSearchParams();

  const zoomToStart = (startPoint) => {
    if (mapRef?.current && startPoint) {
      mapRef.current.animateToRegion({
        latitude: startPoint.latitude,
        longitude: startPoint.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  useEffect(() => {
    const { startLat, startLng, endLat, endLng } = params || {};

    if (startLat && startLng && endLat && endLng) {
      const start = {
        latitude: parseFloat(startLat as string),
        longitude: parseFloat(startLng as string),
      };
      const end = {
        latitude: parseFloat(endLat as string),
        longitude: parseFloat(endLng as string),
      };
      fetchAndDisplayRoute(start, end);
    }
  }, [params?.startLat, params?.startLng, params?.endLat, params?.endLng]);

  const fetchAndDisplayRoute = async (start, end) => {
    try {
      if (start && end ) {
        const startCoords = `${start.latitude},${start.longitude}`;
        const endCoords = `${end.latitude},${end.longitude}`;
        const API_KEY = process.env.EXPO_PUBLIC_TOMTOM_API_KEY;
        const routeMode = "Rapide"

        const baseURL = `https://api.tomtom.com/routing/1/calculateRoute/${startCoords}:${endCoords}/json`;
        const commonParams = `key=${API_KEY}&routeType=${routeMode === 'Rapide' ? 'fastest' : 'shortest'}&travelMode=car&instructionsType=text&language=fr-FR`;

        const requests = [
          fetch(`${baseURL}?${commonParams}`), // avec péages
          fetch(`${baseURL}?${commonParams}&avoid=tollRoads`) // sans péages
        ];

        const responses = await Promise.all(requests);
        const data = await Promise.all(responses.map(res => res.json()));

        const [routeWithToll, routeWithoutToll] = data;

        // Tu peux choisir ici celle que tu veux afficher, exemple : avec péages
        const route = routeWithToll.routes[0];

        const coordinates = route.legs.flatMap(leg =>
          leg.points.map(point => ({
            latitude: point.latitude,
            longitude: point.longitude
          }))
        );

        const instructions = route.guidance?.instructions?.map((instruction, idx) => ({
          id: idx.toString(),
          message: instruction.message,
          roadName: instruction.roadName || '',
          point: {
            latitude: instruction.point.latitude,
            longitude: instruction.point.longitude
          }
        })) || [];

        const summary = route.summary;

        setRouteCoordinates(coordinates);
        setRouteInstructions(instructions);
        setRouteSummary(summary);

        zoomToStart(coordinates[0]);

      }
      }catch(error){
      }

  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      setGeoEnabled(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    const startWatching = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const watcher = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (loc) => {
          setStartLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
        }
      );

      return () => watcher.remove();
    };

    startWatching();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReports();
      initializeLocation();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const zoomToCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Erreur', 'Permission de localisation refusée');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    mapRef.current?.animateCamera(
      {
        center: { latitude, longitude },
        pitch: 0,
        zoom: 17,
      },
      { duration: 1000 }
    );
  };

  const zoomToRoute = (coordinates) => {
    if (!coordinates || coordinates.length === 0 || !mapRef.current) return;

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

    const latDelta = (maxLat - minLat) * 1.2;
    const lngDelta = (maxLng - minLng) * 1.2;

    mapRef.current.animateToRegion({
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max(latDelta, 0.01),
      longitudeDelta: Math.max(lngDelta, 0.01),
    }, 1000);
  };

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
      const response = await api.get('/api/reports/get-all');
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

      await api.post('/api/reports/create', payload);

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
      await api.post(`/api/reports/${id}/like`);
      fetchReports();
    } catch (error) {
      console.error('Error liking report:', error);
      Alert.alert('Erreur', 'Impossible de liker le signalement');
    }
  };

  const handleDislikeReport = async (id) => {
    try {
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

  const handleRouteInstructions = (instructions, summary, dest = null) => {
    setRouteInstructions(instructions);
    setRouteSummary(summary);
    setShowInstructions(true);
    if (dest) {
      setDestination(dest.location);
      setDestinationAddress(dest.address);
    }

    if (routeCoordinates && routeCoordinates.length > 0) {
      zoomToRoute(routeCoordinates);
    }
  };

  const refreshRoute = async () => {
    if (!startLocation || !routeCoordinates || routeCoordinates.length === 0) {
      Alert.alert('Erreur', 'Position de départ ou destination manquante');
      return;
    }

    try {
      setRefreshing(true);
      const currentLocation = await getCurrentLocation();
      if (currentLocation) {
        const updatedStartLocation = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        };
        setStartLocation(updatedStartLocation);

        const lastCoord = routeCoordinates[routeCoordinates.length - 1];

        const startCoords = `${updatedStartLocation.latitude},${updatedStartLocation.longitude}`;
        const endCoords = `${lastCoord.latitude},${lastCoord.longitude}`;
        const API_KEY = process.env.EXPO_PUBLIC_TOMTOM_API_KEY;
        const routeMode = 'Rapide'; // ou selon ton état
        const vehicleType = 'car';  // ou selon ton choix

        const url = `https://api.tomtom.com/routing/1/calculateRoute/${startCoords}:${endCoords}/json?key=${API_KEY}&routeType=${routeMode === 'Rapide' ? 'fastest' : 'shortest'}&travelMode=${vehicleType}&instructionsType=text&language=fr-FR`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const coordinates = route.legs.flatMap(leg =>
            leg.points.map(point => ({
              latitude: point.latitude,
              longitude: point.longitude
            }))
          );

          const instructions = route.guidance?.instructions?.map((instruction, idx) => ({
            id: idx.toString(),
            message: instruction.message,
            roadName: instruction.roadName || '',
            point: {
              latitude: instruction.point.latitude,
              longitude: instruction.point.longitude
            }
          })) || [];

          setRouteCoordinates(coordinates);
          setRouteInstructions(instructions);
          setRouteSummary(route.summary);
          zoomToRoute(coordinates);
          Alert.alert('Succès', 'Trajet mis à jour avec succès');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du trajet :', error);
      Alert.alert('Erreur', `Impossible de mettre à jour le trajet: ${error.message}`);
    } finally {
      setRefreshing(false);
    }
  };



  const clearRoute = () => {
    setRouteCoordinates([]);
    setRouteInstructions([]);
    setRouteSummary(null);
    setShowInstructions(false);
    setDestination(null);
    setDestinationAddress('');

    if (startLocation) {
      mapRef.current?.animateCamera(
        {
          center: startLocation,
          pitch: 0,
          zoom: 17,
        },
        { duration: 1000 }
      );
    }

    Alert.alert('Trajet supprimé', 'L\'itinéraire a été effacé');
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes} min`;
  };

  const formatDistance = (meters) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${meters} m`;
  };

  if (locationState.loading || isLoading) {
    return <LoadingIndicator message="Chargement de la carte..." />;
  }

  return (
    <View style={styles.container}>
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
          <Marker coordinate={startLocation}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <View
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: 25,
                  backgroundColor: '#3498db',
                }}
              />
            </View>
            <Callout tooltip>
              <View
                style={{
                  backgroundColor: 'white',
                  padding: 6,
                  borderRadius: 6,
                  borderColor: '#3498db',
                  borderWidth: 1,
                }}
              >
                <Text style={{ color: '#3498db', fontWeight: 'bold' }}>Je suis là</Text>
              </View>
            </Callout>
          </Marker>
        )}

        {routeCoordinates.length > 0 && (
          <>
            <Polyline
              coordinates={routeCoordinates}
              strokeWidth={5}
              strokeColor="#3498db"
              lineCap="round"
              lineJoin="round"
            />
            <Marker coordinate={routeCoordinates[0]}>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <View
                  style={{
                    width: 25,
                    height: 25,
                    borderRadius: 25,
                    backgroundColor: '#3498db',
                  }}
                />
              </View>
            </Marker>

            <Marker coordinate={routeCoordinates[routeCoordinates.length - 1]}>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <View
                  style={{
                    width: 25,
                    height: 25,
                    borderRadius: 25,
                    backgroundColor: '#ff0000',
                  }}
                />
              </View>
            </Marker>
          </>
        )}
      </MapView>

      {showInstructions && routeInstructions.length > 0 && (
        <View style={styles.instructionsContainer}>
          <View style={styles.iconActions}>
            <TouchableOpacity onPress={() => setShowInstructions(false)}>
              <X size={20} color="#333" />
            </TouchableOpacity>
          </View>

          {routeSummary && (
            <View style={styles.routeSummary}>
              <Text style={styles.routeSummaryTitle}>
                {formatDistance(routeSummary.lengthInMeters)} · {formatTime(routeSummary.travelTimeInSeconds)}
              </Text>
              {destinationAddress && (
                <Text style={styles.destinationText}>Destination: {destinationAddress}</Text>
              )}
            </View>
          )}

          <ScrollView style={styles.instructionsList}>
            {routeInstructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction.message}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.routeActionButtons}>
            <TouchableOpacity
              style={[styles.routeActionButton, styles.refreshButton]}
              onPress={refreshRoute}
              disabled={refreshing}
            >
              <RefreshCw size={20} color="#fff" />
              <Text style={styles.routeActionButtonText}>
                {refreshing ? 'Mise à jour...' : 'Rafraîchir'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.routeActionButton, styles.clearButton]}
              onPress={clearRoute}
            >
              <Trash2 size={20} color="#fff" />
              <Text style={styles.routeActionButtonText}>Supprimer</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.collapseButton}
            onPress={() => setShowInstructions(false)}
          >
            <ChevronUp size={20} color="#fff" />
            <Text style={styles.collapseButtonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        onPress={zoomToCurrentLocation}
        style={styles.locationButton}
      >
        <MaterialIcons name="my-location" size={28} color="#fff" />
      </TouchableOpacity>

      <View style={styles.actionsContainer}>
        {!showInstructions && routeInstructions.length > 0 && routeCoordinates.length > 0 &&  (
          <TouchableOpacity
            style={[styles.actionButton, styles.instructionsButton]}
            onPress={() => setShowInstructions(true)}>
            <AlertCircle size={24} color="white" />
            <Text style={styles.actionText}>Instruction</Text>
          </TouchableOpacity>
        )}

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
            <TouchableOpacity onPress={() => setSelectedReport(null)}>
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
              <TouchableOpacity onPress={() => setShowReportModal(false)}>
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
              editable={false}
            />

            {!geoEnabled && (
              <Text style={{ color: 'red' }}>
                Activez la géolocalisation pour saisir une adresse.
              </Text>
            )}

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
            <RouteModal
              setShowRouteModal={setShowRouteModal}
              tomtomApi={tomtomApi}
              api={api}
              authState={authState}
              mapRef={mapRef}
              setRouteCoordinates={setRouteCoordinates}
              setRouteInstructions={handleRouteInstructions}
            />
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
  instructionsButton: {
    backgroundColor: '#27ae60',
  },
  actionText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 12,
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
  locationButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  instructionsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    padding: 16,
    maxHeight: '40%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  instructionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  routeSummary: {
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
  },
  routeSummaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  instructionsList: {
    maxHeight: 200,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  instructionNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  collapseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 10,
  },
  collapseButtonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: '600',
  },
  iconActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 16,
  },

  routeActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },

  refreshButton: {
    backgroundColor: '#4A90E2',
  },

  clearButton: {
    backgroundColor: '#D0021B',
  },

  routeActionButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
});