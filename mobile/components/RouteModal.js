import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
  Modal
} from 'react-native';
import { X, MapPin, Search, Car, Bus } from 'lucide-react-native';
import Button from '@/components/Button';
import RouteOptionsModal from '@/components/RouteOptionsModal';
import { KeyboardAvoidingView } from 'react-native';
import * as Location from 'expo-location';

const styles = {
  modalContent: { padding: 16, backgroundColor: '#fff', borderRadius: 8 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  inputLabel: { marginTop: 12, marginBottom: 4, fontWeight: '500' },
  locationInputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  locationInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 4 },
  locationButton: { padding: 8, marginLeft: 8 },
  optionsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12 },
  optionButton: { flex: 1, padding: 12, borderWidth: 1, borderColor: '#ddd', marginHorizontal: 4, borderRadius: 4, alignItems: 'center' },
  optionButtonActive: { backgroundColor: '#3498db', borderColor: '#3498db' },
  optionText: { color: '#333' },
  optionTextActive: { color: '#fff' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  modalButton: { flex: 1, marginHorizontal: 4 },
  tollOptionContainer: { marginVertical: 12 },
  vehicleTypeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12 },
  vehicleButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderWidth: 1, borderColor: '#ddd', marginHorizontal: 4, borderRadius: 4 },
  vehicleButtonActive: { backgroundColor: '#3498db', borderColor: '#3498db' },
  vehicleText: { color: '#333', marginLeft: 8 },
  vehicleTextActive: { color: '#fff' },
  suggestionsContainer: { marginTop: 4, marginBottom: 12, maxHeight: 150, borderWidth: 1, borderColor: '#ddd', borderRadius: 4 },
  suggestionItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  suggestionText: { fontSize: 14 },
  loadingContainer: { padding: 12, alignItems: 'center' },
  errorText: { color: '#e74c3c', marginTop: 4, fontSize: 12 },
  suggestionSecondaryText: { fontSize: 12, color: '#666', marginTop: 2 }
};

const RouteModal = ({
                      setShowRouteModal,
                      tomtomApi,
                      api,
                      authState,
                      setRouteCoordinates,
                      setRouteInstructions,
                      mapRef
                    }) => {
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [routeMode, setRouteMode] = useState('Rapide');
  const [vehicleType, setVehicleType] = useState('car');
  const [isLoading, setIsLoading] = useState(false);

  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);
  const [isLoadingStartSuggestions, setIsLoadingStartSuggestions] = useState(false);
  const [isLoadingEndSuggestions, setIsLoadingEndSuggestions] = useState(false);
  const [startSearchTimeout, setStartSearchTimeout] = useState(null);
  const [endSearchTimeout, setEndSearchTimeout] = useState(null);
  const [routeOptions, setRouteOptions] = useState([]);
  const [showRouteOptionsModal, setShowRouteOptionsModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const searchAddresses = async (text, isStart) => {
    if (!text || text.length < 2) {
      if (isStart) {
        setStartSuggestions([]);
        setIsLoadingStartSuggestions(false);
      } else {
        setEndSuggestions([]);
        setIsLoadingEndSuggestions(false);
      }
      return;
    }

    try {
      isStart ? setIsLoadingStartSuggestions(true) : setIsLoadingEndSuggestions(true);
      setErrorMessage('');

      const response = await tomtomApi.get('/search/2/search/' + encodeURIComponent(text) + '.json', {
        params: {
          limit: 10,
          idxSet: 'Addr,Str,Geo',
          typeahead: true,
          countrySet: 'FR,BE,CH,LU,DE,ES,IT',
          language: 'fr-FR',
          extendedPostalCodesFor: 'Addr',
          minFuzzyLevel: 1,
          maxFuzzyLevel: 2
        }
      });

      if (response.data && response.data.results) {
        const suggestions = response.data.results.map(result => ({
          id: result.id,
          address: result.address.freeformAddress,
          position: result.position,
          fullAddress: {
            street: result.address.streetName || '',
            houseNumber: result.address.streetNumber || '',
            city: result.address.municipality || '',
            postalCode: result.address.postalCode || '',
            country: result.address.country || ''
          },
          context: `${result.address.municipality || ''} ${result.address.postalCode || ''}`.trim()
        }));

        if (isStart) {
          setStartSuggestions(suggestions);
          setIsLoadingStartSuggestions(false);
        } else {
          setEndSuggestions(suggestions);
          setIsLoadingEndSuggestions(false);
        }
      }
    } catch (error) {
      console.error('Error searching addresses:', error);
      if (isStart) {
        setIsLoadingStartSuggestions(false);
      } else {
        setIsLoadingEndSuggestions(false);
      }
      setErrorMessage('Erreur lors de la recherche d\'adresses. Veuillez réessayer.');
    }
  };

  const handleStartAddressChange = (text) => {
    setStartAddress(text);
    setErrorMessage('');

    if (startSearchTimeout) {
      clearTimeout(startSearchTimeout);
    }

    const timeout = setTimeout(() => {
      searchAddresses(text, true);
    }, 400);

    setStartSearchTimeout(timeout);
  };

  const handleEndAddressChange = (text) => {
    setEndAddress(text);
    setErrorMessage('');

    if (endSearchTimeout) {
      clearTimeout(endSearchTimeout);
    }

    const timeout = setTimeout(() => {
      searchAddresses(text, false);
    }, 400);

    setEndSearchTimeout(timeout);
  };

  const selectStartSuggestion = (suggestion) => {
    setStartAddress(suggestion.address);
    setStartLocation({
      latitude: suggestion.position.lat,
      longitude: suggestion.position.lon
    });
    setStartSuggestions([]);
  };

  const selectEndSuggestion = (suggestion) => {
    setEndAddress(suggestion.address);
    setEndLocation({
      latitude: suggestion.position.lat,
      longitude: suggestion.position.lon
    });
    setEndSuggestions([]);
  };

  useEffect(() => {
    return () => {
      if (startSearchTimeout) clearTimeout(startSearchTimeout);
      if (endSearchTimeout) clearTimeout(endSearchTimeout);
    };
  }, [startSearchTimeout, endSearchTimeout]);

  const calculateRoute = async () => {
    if (!startLocation) {
      setErrorMessage('Point de départ non défini. Utilisez le bouton de localisation ou recherchez une adresse.');
      return;
    }

    if (!endLocation) {
      setErrorMessage('Veuillez définir une destination en recherchant une adresse.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');

      const startCoords = `${startLocation.latitude},${startLocation.longitude}`;
      const endCoords = `${endLocation.latitude},${endLocation.longitude}`;
      const API_KEY = process.env.EXPO_PUBLIC_TOMTOM_API_KEY;

      const requests = [
        fetch(`https://api.tomtom.com/routing/1/calculateRoute/${startCoords}:${endCoords}/json?key=${API_KEY}&routeType=${routeMode === 'Rapide' ? 'fastest' : 'shortest'}&travelMode=${vehicleType}&instructionsType=text&language=fr-FR`),
        fetch(`https://api.tomtom.com/routing/1/calculateRoute/${startCoords}:${endCoords}/json?key=${API_KEY}&routeType=${routeMode === 'Rapide' ? 'fastest' : 'shortest'}&travelMode=${vehicleType}&instructionsType=text&avoid=tollRoads&language=fr-FR`)
      ];

      const responses = await Promise.all(requests);
      const results = await Promise.all(responses.map(res => res.json()));

      if (results[0]?.routes?.[0]?.summary?.travelTimeInSeconds && results[1]?.routes?.[0]?.summary?.travelTimeInSeconds) {
        const travelTimeFirstRoute = results[0]?.routes?.[0]?.summary?.travelTimeInSeconds ?? 2000;
        const travelTimeSecondRoute = results[1]?.routes?.[0]?.summary?.travelTimeInSeconds ?? 2000;

        const routesData = [
          {
            ...results[0],
            hasTolls: true,
            isRecommended: travelTimeFirstRoute < travelTimeSecondRoute * 1.2
          },
          {
            ...results[1],
            hasTolls: false,
            isRecommended: travelTimeFirstRoute >= travelTimeSecondRoute * 1.2
          }
        ];

        setRouteOptions(routesData);
        setShowRouteOptionsModal(true);
      } else {
        setErrorMessage("Erreur: Une ou plusieurs routes n'ont pas de données de durée.");
      }

    } catch (error) {
      console.error('Error calculating routes:', error);
      setErrorMessage('Impossible de calculer les itinéraires. Veuillez vérifier vos adresses et réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectRoute = async (selectedRoute) => {
    try {
      const routePayload = {
        startLongitude: String(startLocation.longitude),
        startLatitude: String(startLocation.latitude),
        endLongitude: String(endLocation.longitude),
        endLatitude: String(endLocation.latitude),
        address_start: startAddress || 'Départ',
        address_end: endAddress || 'Arrivée',
        user: authState.user?.id?.toString() || '0',
        mode: routeMode,
        vehicleType: vehicleType,
        peage: selectedRoute.hasTolls
      };

      try {
        await api.post('/api/traffic/create', routePayload);
      } catch (saveError) {
        const message =
          saveError.response?.data?.message || 'Erreur inconnue lors de l’enregistrement de la route.';
        console.error('Erreur API:', message);
        Alert.alert('Erreur', "Vous avez atteint le nombre maximum de 10 itinéraires enregistrés. Veuillez en supprimer un avant d'en créer un nouveau.");
      }

      const route = selectedRoute.routes[0];

      const routePoints = route.legs.flatMap(leg =>
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

      if (setRouteCoordinates) setRouteCoordinates(routePoints);
      if (setRouteInstructions) setRouteInstructions(instructions, summary);

      setShowRouteOptionsModal(false);
      setShowRouteModal(false);

      zoomToRoute();
    } catch (error) {
      console.error('Error processing selected route:', error);
      setErrorMessage(`Erreur: ${error.message}`);
    }
  };

  const zoomToRoute = () => {
    if (mapRef && mapRef.current && startLocation) {
      mapRef.current.animateCamera(
        {
          center: {
            latitude: startLocation.latitude,
            longitude: startLocation.longitude,
          },
          pitch: 0,
          zoom: 17,
          altitude: 200,
        },
        { duration: 1000 }
      );
    }
  };

  const zoomToCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erreur', 'Permission de localisation refusée');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Zoom sur la position
      mapRef.current?.animateCamera(
        {
          center: { latitude, longitude },
          pitch: 0,
          zoom: 17,
        },
        { duration: 1000 }
      );

      // Mettre à jour l’état de la position
      setStartLocation({ latitude, longitude });

      // Faire du reverse geocoding avec TomTom
      try {
        const response = await tomtomApi.get(`/search/2/reverseGeocode/${latitude},${longitude}.json`);
        if (response.data?.addresses?.length > 0) {
          const address = response.data.addresses[0].address;
          const formattedAddress = [
            address.streetNumber || '',
            address.street || '',
            address.streetName || '',
            address.municipalitySubdivision || '',
            address.municipality || '',
            address.postalCode || '',
            address.countrySubdivision || '',
            address.country || ''
          ]
            .filter(Boolean)
            .join(', ');
          setStartAddress(formattedAddress);
        } else {
          setStartAddress(`Position actuelle (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`);
        }
      } catch (error) {
        console.error('Erreur reverse geocoding :', error);
        setStartAddress(`Position actuelle (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`);
      }

    } catch (error) {
      console.error('Erreur de localisation :', error);
      Alert.alert('Erreur', 'Impossible de récupérer la position actuelle');
    }
  };

  return (
    <KeyboardAvoidingView>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Planifier un itinéraire</Text>
          <TouchableOpacity
            onPress={() => setShowRouteModal(false)}
          >
            <X size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <Text style={styles.inputLabel}>Point de départ</Text>
        <View style={styles.locationInputContainer}>
          <TextInput
            style={styles.locationInput}
            value={startAddress}
            onChangeText={handleStartAddressChange}
            placeholder="Adresse de départ"
          />
          <TouchableOpacity
            style={styles.locationButton}
            onPress={zoomToCurrentLocation}
          >
            <MapPin size={20} color="#3498db" />
          </TouchableOpacity>
        </View>

        {isLoadingStartSuggestions ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#3498db" />
          </View>
        ) : startSuggestions.length > 0 ? (
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={startSuggestions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => selectStartSuggestion(item)}
                >
                  <Text style={styles.suggestionText}>{item.address}</Text>
                  {item.context && <Text style={styles.suggestionSecondaryText}>{item.context}</Text>}
                </TouchableOpacity>
              )}
              nestedScrollEnabled={true}
            />
          </View>
        ) : null}

        <Text style={styles.inputLabel}>Destination</Text>
        <View style={styles.locationInputContainer}>
          <TextInput
            style={styles.locationInput}
            value={endAddress}
            onChangeText={handleEndAddressChange}
            placeholder="Adresse de destination"
          />
          <TouchableOpacity
            style={styles.locationButton}
            onPress={() => searchAddresses(endAddress, false)}
          >
            <Search size={20} color="#3498db" />
          </TouchableOpacity>
        </View>

        {isLoadingEndSuggestions ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#3498db" />
          </View>
        ) : endSuggestions.length > 0 ? (
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={endSuggestions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => selectEndSuggestion(item)}
                >
                  <Text style={styles.suggestionText}>{item.address}</Text>
                  {item.context && <Text style={styles.suggestionSecondaryText}>{item.context}</Text>}
                </TouchableOpacity>
              )}
              nestedScrollEnabled={true}
            />
          </View>
        ) : null}

        <Text style={styles.inputLabel}>Type de véhicule</Text>
        <View style={styles.vehicleTypeContainer}>
          <TouchableOpacity
            style={[
              styles.vehicleButton,
              vehicleType === 'car' && styles.vehicleButtonActive
            ]}
            onPress={() => setVehicleType('car')}
          >
            <Car size={18} color={vehicleType === 'car' ? '#fff' : '#333'} />
            <Text style={[
              styles.vehicleText,
              vehicleType === 'car' && styles.vehicleTextActive
            ]}>Voiture</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.vehicleButton,
              vehicleType === 'bus' && styles.vehicleButtonActive
            ]}
            onPress={() => setVehicleType('bus')}
          >
            <Bus size={18} color={vehicleType === 'bus' ? '#fff' : '#333'} />
            <Text style={[
              styles.vehicleText,
              vehicleType === 'bus' && styles.vehicleTextActive
            ]}>Bus</Text>
          </TouchableOpacity>
        </View>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <View style={styles.modalActions}>
          <Button
            title="Annuler"
            variant="outline"
            onPress={() => setShowRouteModal(false)}
            style={styles.modalButton}
          />
          <Button
            title={isLoading ? "Calcul en cours..." : "Calculer"}
            onPress={calculateRoute}
            style={styles.modalButton}
            disabled={isLoading}
          />
        </View>
      </View>
      {showRouteOptionsModal && (
        <Modal
          visible={showRouteOptionsModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowRouteOptionsModal(false)}
        >
          <View style={{flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <RouteOptionsModal
              routes={routeOptions}
              onSelectRoute={selectRoute}
              onClose={() => setShowRouteOptionsModal(false)}
            />
          </View>
        </Modal>
      )}
    </KeyboardAvoidingView>
  );
};

export default RouteModal;