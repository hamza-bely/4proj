import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  FlatList,
  ActivityIndicator, Modal
} from 'react-native';
import { X, MapPin, Search } from 'lucide-react-native';
import Button from '@/components/Button';
import RouteOptionsModal from '@/components/RouteOptionsModal';

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
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: '#ddd', borderRadius: 4, marginRight: 8, justifyContent: 'center', alignItems: 'center' },
  checkboxActive: { borderColor: '#3498db' },
  checkboxInner: { width: 12, height: 12, backgroundColor: '#3498db', borderRadius: 2 },
  checkboxLabel: { fontSize: 16 },

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
                    }) => {
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [routeMode, setRouteMode] = useState('Rapide');
  const [avoidTolls, setAvoidTolls] = useState(false);
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

  const handleStartLocationSelect = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      if (navigator.geolocation && Platform.OS === 'web') {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const currentPosition = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };

            setStartLocation(currentPosition);

            try {
              const response = await tomtomApi.get(`/search/2/reverseGeocode/${currentPosition.latitude},${currentPosition.longitude}.json`);
              if (response.data && response.data.addresses && response.data.addresses.length > 0) {
                const address = response.data.addresses[0].address;
                // Format plus détaillé pour l'adresse
                const formattedAddress = [
                  address.streetNumber || '',
                  address.street || '',
                  address.streetName || '',
                  address.municipalitySubdivision || '',
                  address.municipality || '',
                  address.postalCode || '',
                  address.countrySubdivision || '',
                  address.country || ''
                ].filter(Boolean).join(', ');

                setStartAddress(formattedAddress);
              }
              setIsLoading(false);
            } catch (error) {
              console.error('Error getting address from coordinates:', error);
              setStartAddress(`Position actuelle (${currentPosition.latitude.toFixed(5)}, ${currentPosition.longitude.toFixed(5)})`);
              setIsLoading(false);
            }
          },
          (error) => {
            console.error('Error getting position:', error);
            const parisPosition = {
              latitude: 48.8566,
              longitude: 2.3522
            };
            setStartLocation(parisPosition);
            setStartAddress('Paris, France');
            setIsLoading(false);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } else {
        const defaultPosition = {
          latitude: 48.8566,
          longitude: 2.3522
        };

        setStartLocation(defaultPosition);

        try {
          const response = await tomtomApi.get(`/search/2/reverseGeocode/${defaultPosition.latitude},${defaultPosition.longitude}.json`);
          if (response.data && response.data.addresses && response.data.addresses.length > 0) {
            const address = response.data.addresses[0].address;
            const formattedAddress = [
              address.streetNumber || '',
              address.street || '',
              address.municipality || '',
              address.postalCode || '',
              address.country || ''
            ].filter(Boolean).join(', ');

            setStartAddress(formattedAddress);
          }
        } catch (error) {
          console.error('Error getting address from coordinates:', error);
          setStartAddress(`Position actuelle (${defaultPosition.latitude.toFixed(5)}, ${defaultPosition.longitude.toFixed(5)})`);
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert('Erreur', 'Impossible d\'obtenir votre position actuelle');
      setIsLoading(false);
    }
  };

  // Amélioration de la recherche d'adresses
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

      // Paramètres de recherche améliorés pour des résultats plus précis
      const response = await tomtomApi.get('/search/2/search/' + encodeURIComponent(text) + '.json', {
        params: {
          limit: 10,              // Plus de résultats
          idxSet: 'Addr,Str,Geo',          // Recherche géographique
          typeahead: true,        // Suggestions pendant la saisie
          countrySet: 'FR,BE,CH,LU,DE,ES,IT', // Élargir les pays de recherche
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
      console.log('Calculating routes from', startLocation, 'to', endLocation);

      const startCoords = `${startLocation.latitude},${startLocation.longitude}`;
      const endCoords = `${endLocation.latitude},${endLocation.longitude}`;
      const API_KEY = '9zc7scbLhpcrEFouo0xJWt0jep9qNlnv';

      // Calculer deux itinéraires : avec et sans péage
      const requests = [
        fetch(`https://api.tomtom.com/routing/1/calculateRoute/${startCoords}:${endCoords}/json?key=${API_KEY}&routeType=${routeMode === 'Rapide' ? 'fastest' : 'shortest'}&travelMode=car&instructionsType=text`),
        fetch(`https://api.tomtom.com/routing/1/calculateRoute/${startCoords}:${endCoords}/json?key=${API_KEY}&routeType=${routeMode === 'Rapide' ? 'fastest' : 'shortest'}&travelMode=car&instructionsType=text`)
      ];

      console.log("requests",requests);

      const responses = await Promise.all(requests);
      const results = await Promise.all(responses.map(res => res.json()));
      console.log("results", results[0].routes[0].summary.travelTimeInSeconds);

      if (results[0]?.routes?.[0]?.summary?.travelTimeInSeconds && results[1]?.routes?.[0]?.summary?.travelTimeInSeconds) {
        console.log('Routes calculation successful');

        const travelTimeFirstRoute = results[0]?.routes?.[0]?.summary?.travelTimeInSeconds ?? 2000;
        const travelTimeSecondRoute = results[1]?.routes?.[0]?.summary?.travelTimeInSeconds ?? 2000;

        const routesData = [
          {
            ...results[0],
            hasTolls: false,
            isRecommended: travelTimeFirstRoute < travelTimeSecondRoute * 1.2 // Si le trajet sans péage est moins de 20% plus long que celui avec péage
          },
          {
            ...results[1],
            hasTolls: true,
            isRecommended: travelTimeFirstRoute >= travelTimeSecondRoute * 1.2 // Si le trajet avec péage est plus rapide
          }
        ];

        setRouteOptions(routesData);
        setShowRouteOptionsModal(true);
      } else {
        console.error("Erreur: Une ou plusieurs routes n'ont pas de données de durée.");
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
      // Sauvegarder l'itinéraire dans l'API
      const routePayload = {
        startLongitude: String(startLocation.longitude),
        startLatitude: String(startLocation.latitude),
        endLongitude: String(endLocation.longitude),
        endLatitude: String(endLocation.latitude),
        address_start: startAddress || 'Départ',
        address_end: endAddress || 'Arrivée',
        user: authState.user?.id?.toString() || '0',
        mode: routeMode,
        peage: selectedRoute.hasTolls
      };

      try {
        await api.post('/api/traffic/create', routePayload);
        console.log('Route saved successfully');
      } catch (saveError) {
        console.error('Error saving route to API:', saveError);
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

      // Mettre à jour les états avec les données de route
      if (setRouteCoordinates) setRouteCoordinates(routePoints);
      if (setRouteInstructions) setRouteInstructions(instructions, summary);
      if (setEndLocation) setEndLocation(endLocation);

      // Fermer les modales
      setShowRouteOptionsModal(false);
      setShowRouteModal(false);

      // Zoomer sur le départ
      zoomToStart();
    } catch (error) {
      console.error('Error processing selected route:', error);
      setErrorMessage(`Erreur: ${error.message}`);
    }
  };

// 4. Nouvelle fonction pour zoomer sur le point de départ
  const zoomToStart = () => {
    if (mapRef && mapRef.current && startLocation) {
      mapRef.current.animateToRegion({
        latitude: startLocation.latitude,
        longitude: startLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      }, 1000);
    }
  };

  return (
    <ScrollView>
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
            onPress={handleStartLocationSelect}
          >
            <MapPin size={20} color="#3498db" />
          </TouchableOpacity>
        </View>

        {/* Suggestions pour l'adresse de départ */}
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

        {/* Suggestions pour l'adresse de destination */}
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

        <Text style={styles.inputLabel}>Mode de trajet</Text>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              routeMode === 'Rapide' && styles.optionButtonActive,
            ]}
            onPress={() => setRouteMode('Rapide')}
          >
            <Text
              style={[
                styles.optionText,
                routeMode === 'Rapide' && styles.optionTextActive,
              ]}
            >
              Le plus rapide
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionButton,
              routeMode === 'Court' && styles.optionButtonActive,
            ]}
            onPress={() => setRouteMode('Court')}
          >
            <Text
              style={[
                styles.optionText,
                routeMode === 'Court' && styles.optionTextActive,
              ]}
            >
              Le plus court
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tollOptionContainer}>
          <Text style={styles.inputLabel}>Options</Text>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAvoidTolls(!avoidTolls)}
          >
            <View
              style={[
                styles.checkbox,
                avoidTolls && styles.checkboxActive,
              ]}
            >
              {avoidTolls && <View style={styles.checkboxInner} />}
            </View>
            <Text style={styles.checkboxLabel}>Éviter les péages</Text>
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
          <View style={styles.modalContainer}>
            <RouteOptionsModal
              routes={routeOptions}
              onSelectRoute={selectRoute}
              onClose={() => setShowRouteOptionsModal(false)}
            />
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

export default RouteModal;