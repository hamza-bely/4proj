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
  ActivityIndicator
} from 'react-native';
import { X, MapPin, Search } from 'lucide-react-native';
import Button from '@/components/Button';

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
  loadingContainer: { padding: 12, alignItems: 'center' }
};

const RouteModal = ({
                      setShowRouteModal,
                      tomtomApi,
                      api,
                      authState,
                      setWebViewUrl,
                      setShowWebViewMap,
                      mapRef,
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

  // Utiliser la géolocalisation du navigateur pour obtenir la position actuelle
  const handleStartLocationSelect = async () => {
    try {
      setIsLoading(true);

      // Utiliser la géolocalisation du navigateur/appareil si disponible
      if (navigator.geolocation && Platform.OS === 'web') {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const currentPosition = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };

            setStartLocation(currentPosition);

            // Faire une requête de géocodage inverse pour obtenir l'adresse précise
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
            // Fallback à Paris si la géolocalisation échoue
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
        // Sur les appareils mobiles ou si la géolocalisation n'est pas disponible
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
    if (!text || text.length < 3) {
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

      // Améliorons les paramètres de recherche pour des résultats plus précis
      const response = await tomtomApi.get('/search/2/search/' + encodeURIComponent(text) + '.json', {
        params: {
          limit: 7,               // Plus de résultats
          idxSet: 'Geo',          // Recherche géographique
          typeahead: true,        // Suggestions pendant la saisie
          countrySet: 'FR',       // Par défaut en France (à adapter si nécessaire)
          language: 'fr-FR'       // Langue française
        }
      });

      if (response.data && response.data.results) {
        const suggestions = response.data.results.map(result => ({
          id: result.id,
          address: result.address.freeformAddress,
          position: result.position,
          // Informations supplémentaires pour avoir plus de contexte
          fullAddress: {
            street: result.address.streetName || '',
            houseNumber: result.address.streetNumber || '',
            city: result.address.municipality || '',
            postalCode: result.address.postalCode || '',
            country: result.address.country || ''
          }
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
    }
  };

  const handleStartAddressChange = (text) => {
    setStartAddress(text);

    // Annuler la recherche précédente si elle est en cours
    if (startSearchTimeout) {
      clearTimeout(startSearchTimeout);
    }

    // Définir un délai pour éviter trop d'appels API pendant la saisie
    const timeout = setTimeout(() => {
      searchAddresses(text, true);
    }, 500);

    setStartSearchTimeout(timeout);
  };

  const handleEndAddressChange = (text) => {
    setEndAddress(text);

    if (endSearchTimeout) {
      clearTimeout(endSearchTimeout);
    }

    const timeout = setTimeout(() => {
      searchAddresses(text, false);
    }, 500);

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

  // Amélioration du calcul d'itinéraire
  const calculateRoute = async () => {
    if (!startLocation) {
      Alert.alert('Erreur', 'Point de départ non défini. Utilisez le bouton de localisation ou recherchez une adresse.');
      return;
    }

    if (!endLocation) {
      Alert.alert('Erreur', 'Veuillez définir une destination en recherchant une adresse');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Calculating route from', startLocation, 'to', endLocation);

      // Préparer les coordonnées pour TomTom
      const startCoords = `${startLocation.latitude},${startLocation.longitude}`;
      const endCoords = `${endLocation.latitude},${endLocation.longitude}`;

      // Enregistrement de l'itinéraire dans la BD (comme avant)
      const routePayload = {
        startLongitude: String(startLocation.longitude),
        startLatitude: String(startLocation.latitude),
        endLongitude: String(endLocation.longitude),
        endLatitude: String(endLocation.latitude),
        address_start: startAddress || 'Départ',
        address_end: endAddress || 'Arrivée',
        user: authState.user?.id?.toString() || '0',
        mode: routeMode,
        peage: !avoidTolls
      };

      try {
        await api.post('/api/traffic/create', routePayload);
        console.log('Route saved successfully');
      } catch (saveError) {
        console.error('Error saving route to API:', saveError);
      }

      // Configurer les paramètres de l'API de routing
      const routeType = routeMode === 'Rapide' ? 'fastest' : 'shortest';
      const avoid = avoidTolls ? 'toll' : '';

      try {
        // Appel direct à l'API TomTom routing avec plus de paramètres
        const routeResponse = await tomtomApi.get(`/routing/1/calculateRoute/${startCoords}:${endCoords}/json`, {
          params: {
            routeType: routeType,
            avoid: avoid,
            traffic: true,
            instructionsType: 'text',
            travelMode: 'car',
            vehicleCommercial: false,
            detail: 'true',
            report: 'effectiveSettings'
          }
        });

        console.log('Route calculation successful');

        if (routeResponse.data && routeResponse.data.routes && routeResponse.data.routes.length > 0) {
          const route = routeResponse.data.routes[0];

          // Extraire les coordonnées pour dessiner la polyline
          const routePoints = route.legs.flatMap(leg =>
            leg.points.map(point => ({
              latitude: point.latitude,
              longitude: point.longitude
            }))
          );

          // Extraire les instructions pour l'affichage
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

          // Créer une URL Google Maps pour l'affichage dans la WebView
          const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${startLocation.latitude},${startLocation.longitude}&destination=${endLocation.latitude},${endLocation.longitude}&travelmode=driving`;

          console.log("Setting Google Maps URL:", googleMapsUrl);

          if (setWebViewUrl) setWebViewUrl(googleMapsUrl);
          if (setShowWebViewMap) setShowWebViewMap(true);

          // Fermer la modale de route
          setShowRouteModal(false);
        } else {
          throw new Error('No route data found in response');
        }
      } catch (routeError) {
        console.error('Error calculating route with API:', routeError);

        // Même en cas d'erreur avec l'API TomTom, tentons d'ouvrir Google Maps
        try {
          const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${startLocation.latitude},${startLocation.longitude}&destination=${endLocation.latitude},${endLocation.longitude}&travelmode=driving`;

          if (setWebViewUrl) setWebViewUrl(googleMapsUrl);
          if (setShowWebViewMap) setShowWebViewMap(true);
        } catch (gmapsError) {
          console.error('Failed to fallback to Google Maps:', gmapsError);
        }

        setShowRouteModal(false);
      }
    } catch (error) {
      console.error('General error calculating route:', error);
      Alert.alert(
        'Erreur',
        `Impossible de calculer l'itinéraire: ${error.message}`
      );
    } finally {
      setIsLoading(false);
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
    </ScrollView>
  );
};

export default RouteModal;