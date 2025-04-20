import React, { useState, useEffect, useCallback } from 'react';
import {
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  StyleSheet,
  TextInput,
  View,
  useColorScheme,
  Text,
  TouchableOpacity,
  FlatList,
  Image
} from 'react-native';
import { Colors } from '@/constants/Colors';
import TomTomMap from '@components/TomTomMaps';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';

interface AddressSuggestion {
  id: string;
  address: {
    freeformAddress: string;
  };
  position: {
    lat: number;
    lon: number;
  };
}

interface RouteOption {
  guidance: any;
  summary: {
    travelTimeInSeconds: number;
    lengthInMeters: number;
  };
  legs: [
    {
      points: string;
    }
  ];
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const textColor = isDark ? '#fff' : '#000';
  const borderColor = isDark ? '#fff' : '#000';
  const [searchText, setSearchText] = useState<string>('');
  const [destination, setDestination] = useState<{ latitude: number; longitude: number } | null>(null);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressSuggestion | null>(null);
  const [speed, setSpeed] = useState<number | null>(null);
  const [travelTime, setTravelTime] = useState<number | null>(null);
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [currentInstruction, setCurrentInstruction] = useState<string | null>(null);
  const [currentDistance, setCurrentDistance] = useState<number>(0);



  useEffect(() => {
    if (searchText.length > 2) {
      fetchSuggestions(searchText);
    } else {
      setSuggestions([]);
    }
  }, [searchText]);

  useEffect(() => {
    const watchSpeed = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission GPS refusée.');
        return;
      }

      const subscription = Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
        },
        (location) => {
          setSpeed(location.coords.speed);
        }
      );

      return () => {
        subscription.then((sub) => sub.remove());
      };
    };

    watchSpeed();
  }, []);

  useEffect(() => {
    if (destination) {
      fetchRouteOptions(destination);
    }
  }, [destination]);


  

  

  const fetchSuggestions = async (text: string) => {
    try {
      const response = await fetch(`https://api.tomtom.com/search/2/search/${encodeURIComponent(text)}.json?key=QBsKzG3zoRyZeec28eUDje0U8DeNoRSO&typeahead=true&limit=5`);
      const data = await response.json();
      setSuggestions(data.results);
    } catch (error) {
      console.error('Erreur lors de la récupération des suggestions :', error);
    }
  };

  const fetchRouteOptions = async (destination: { latitude: number; longitude: number }) => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const response = await fetch(
        `https://api.tomtom.com/routing/1/calculateRoute/${latitude},${longitude}:${destination.latitude},${destination.longitude}/json?key=QBsKzG3zoRyZeec28eUDje0U8DeNoRSO&routeType=fastest&maxAlternatives=3&instructionsType=text&language=fr`
      );
            const data = await response.json();
      setRouteOptions(data.routes);
      if (data.routes.length > 0) {
        const instructionsArray = data.routes[0].guidance.instructions.map((instr: any) => instr.message);
        setInstructions(instructionsArray);
      }      
    } catch (error) {
      console.error('Erreur lors de la récupération des itinéraires :', error);
    }
  };

  const handleSelectAddress = (address: AddressSuggestion) => {
    Keyboard.dismiss();
    setSearchText(address.address.freeformAddress);
    setSelectedAddress(address);
    setSuggestions([]);
    const { lat, lon } = address.position;
    setDestination({ latitude: lat, longitude: lon });
  };

  const handleSelectRoute = (route: RouteOption) => {
    setSelectedRoute(route);
    if (route.legs && route.legs.length > 0) {
      const routeInstructions = route.guidance?.instructions?.map((instr: any) => instr.message) || [];
      setInstructions(routeInstructions);
    }
  };
  

  const clearRoute = useCallback(() => {
    setDestination(null);
    setSelectedRoute(null);
    setSearchText('');
    setSuggestions([]);
    setRouteOptions([]);
    setSelectedAddress(null);
    setInstructions([]);
  }, []);
  
  

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />

      <TomTomMap destination={destination} routeOptions={routeOptions} selectedRoute={selectedRoute} />

      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientOverlay}
      />

      {selectedRoute && instructions.length > 0 && (
        <View style={styles.roadInstructionContainer}>
          {selectedAddress && (
            <Text style={styles.titleDest}>{selectedAddress.address.freeformAddress}</Text>
          )}

          {currentInstruction && currentDistance > 0 && (
            <>
              <Text style={styles.instructionText}>{currentInstruction}</Text>

              <Text style={styles.distanceText}>{currentDistance} mètres</Text>

              <View style={styles.arrowContainer}>
                {/* <Image
                  source={currentInstruction?.includes('gauche') ? require('./left-arrow.png') : require('./right-arrow.png')}
                  style={styles.arrowIcon}
                /> */}
              </View>
            </>
          )}
        </View>
      )}



      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.tabNavigation, { backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#f9f9f9' }]}>
        {!destination ? (
          <>
            <View style={styles.searchContainer}>
              <TextInput
                placeholder="Où va-t-on ?"
                placeholderTextColor="#888"
                style={styles.textInput}
                value={searchText}
                onChangeText={setSearchText}
              />
              {suggestions.length > 0 && (
                <FlatList
                  data={suggestions}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleSelectAddress(item)}>
                      <Text style={styles.suggestionItem}>{item.address.freeformAddress}</Text>
                    </TouchableOpacity>
                  )}
                  style={styles.suggestionsList}
                />
              )}
            </View>
            <View style={styles.myAddress}>
              <TouchableOpacity style={[styles.addressBlock, { borderColor }]}><Text style={[styles.myAddressText, { color: textColor }]}>Domicile</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.addressBlock, { borderColor }]}><Text style={[styles.myAddressText, { color: textColor }]}>Travail</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.addressBlockAdd, { borderColor }]}><Text style={[styles.myAddressText, { color: textColor }]}>+ Ajouter</Text></TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {!selectedRoute ? (
              <View style={styles.routeInfoContainer}>
                {routeOptions.length > 0 && (
                  <FlatList
                    data={routeOptions}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity style={styles.routeOption} onPress={() => handleSelectRoute(item)}>
                        <Text style={[styles.routeOptionText, { color: textColor }]}>
                          Temps estimé : {(item.summary.travelTimeInSeconds / 60).toFixed(0)} min | Distance : {(item.summary.lengthInMeters / 1000).toFixed(1)} km
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                )}
              </View>
            ) : (
              <View style={styles.routeInfoContainer}>

                <View style={styles.routeInfoRowA}>

                  <View style={styles.speed}>
                  <Text style={styles.speedText}>{Math.round(speed || 0)}</Text>
                    <Text style={styles.speedText}>km/h</Text>
                  </View>


                  <Text style={[styles.selectedRouteText, { color: textColor }]}>
                    {((selectedRoute.summary.travelTimeInSeconds) / 60).toFixed(0)} min
                  </Text>

                  <TouchableOpacity style={styles.clearRouteButton} onPress={clearRoute}>
                    <Text style={styles.clearRouteButtonText}>x</Text>
                  </TouchableOpacity>

                </View> 
                {/* <TouchableOpacity style={styles.clearRouteButton} onPress={() => setSelectedRoute(null)}>
                  <Text style={styles.clearRouteButtonText}>Changer d'itinéraire</Text>
                </TouchableOpacity> */}
              </View>
            )}
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  roadInstructionContainer:{
    position: 'absolute',
    top: 0,
    height: 180,
    width: '100%',
    zIndex: 10,
    backgroundColor:'rgb(0, 0, 0)',
    borderRadius:20,
    paddingTop:75,

  },
  titleDest:{
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 15,
    textAlign:'center'
  },
  instructionTitle: {
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  instructionText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 3,
  },
  distanceText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  arrowIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    height: Platform.OS === 'android' ? 50 : 70,
    width: '100%',
    zIndex: 10,
  },
  tabNavigation: {
    position: 'absolute',
    bottom: 30,
    left: 6,
    right: 6,
    height: 'auto',
    borderRadius: 20,
    zIndex: 20,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  searchContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  textInput: {
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#eee',
    color: '#000',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  suggestionsList: {
    maxHeight: 150,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  routeOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  routeOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedRouteText: {
    fontSize: 30,
    fontWeight: 'bold',

  },
  myAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  addressBlock: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 15,
    borderColor: '#000',
    width: 110,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressBlockAdd: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 15,
    borderColor: '#000',
    width: 110,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffbc2e',
  },
  myAddressText: {
    flexDirection: 'row',
    textAlign: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  routeInfoContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speed: {
    backgroundColor: '#ffbc2e',
    padding: 5,
    width: 70,
    height: 70,
    borderRadius: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  speedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  routeInfoRowA: {
    flexDirection: 'row',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  routeInfoTime: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  clearRouteButton: {
    backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    borderRadius: '100%',
    width: 40,
    height: 40,
  },
  clearRouteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
