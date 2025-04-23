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
import  AddressSuggestion  from '@interfaces/AddressSuggestion';
import  NavigationInstruction  from '@interfaces/NavigationInstruction';
import  RouteOption  from '@interfaces/RouteOption';
import  ClosestInstruction  from '@interfaces/ClosestInstruction';


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
  const [currentInstruction, setCurrentInstruction] = useState<string | null>(null);
  const [currentDistance, setCurrentDistance] = useState<number>(0);
  const [currentManeuver, setCurrentManeuver] = useState<string>('STRAIGHT');
  const [instructions, setInstructions] = useState<NavigationInstruction[]>([]);



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


  
  useEffect(() => {
    const watchPosition = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
  
      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 5,
        },
        (location) => {
          updateCurrentInstruction(location.coords);
        }
      );
  
      return () => sub.remove();
    };
  
    watchPosition();
  }, [selectedRoute]);
  


  
  
  
  const updateCurrentInstruction = (coords: Location.LocationObjectCoords) => {
    if (!selectedRoute || !selectedRoute.guidance || !selectedRoute.guidance.instructions) {
      console.log('selectedRoute or guidance is null');
      return;
    }
  
    const userLat = coords.latitude;
    const userLon = coords.longitude;
  
    let closestInstruction: ClosestInstruction | null = null;
    let minDistance = Number.MAX_SAFE_INTEGER;
  
    for (const instruction of selectedRoute.guidance.instructions) {
      const { point, message } = instruction;
      if (!point) {
        console.log('Instruction point is null');
        continue;
      }
  
      const distance = getDistanceFromLatLonInM(userLat, userLon, point.latitude, point.longitude);
      if (distance < minDistance) {
        minDistance = distance;
        closestInstruction = { message, distance, maneuver: instruction.maneuver };
      }
    }
  
    if (closestInstruction) {
      setCurrentInstruction(closestInstruction.message);
      setCurrentDistance(Math.round(closestInstruction.distance));
      setCurrentManeuver(closestInstruction.maneuver);
    } else {
      console.log('No closest instruction found');
    }
  };
  
  
  const getDistanceFromLatLonInM = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; 
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
  
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c;
  };

  const getInstructionIcon = (instructionType: string) => {
  switch (instructionType) {
    case 'TURN_LEFT':
      return require('@assets/images/turn-left.png');
    case 'TURN_RIGHT':
      return require('@assets/images/turn-right.png');
    case 'STRAIGHT':
      return require('@assets/images/straight.png');
    case 'UTURN_LEFT':
    case 'UTURN_RIGHT':
      return require('@assets/images/u-turn.png');
    case 'ROUNDABOUT_LEFT':
    case 'ROUNDABOUT_RIGHT':
      return require('@assets/images/roundabout.png');
    default:
      return require('@assets/images/straight.png');
  }
};

  

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
        const instructionsArray: NavigationInstruction[] = data.routes[0].guidance.instructions.map((instr: any) => ({
          message: instr.message,
          distance: instr.routeOffsetInMeters,
          maneuver: instr.maneuver,
        }));
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
      const routeInstructions: NavigationInstruction[] = route.guidance?.instructions?.map((instr: any) => ({
        message: instr.message,
        distance: instr.routeOffsetInMeters,
        maneuver: instr.maneuver,
      })) || [];
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
    setCurrentInstruction(null);
    setCurrentDistance(0);
    setCurrentManeuver('');
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
            <View style={styles.roadInstruction}>
              <Image
                source={getInstructionIcon(currentManeuver)}
                style={{ width: (50), height: (50), tintColor: '#00bfff', marginRight: 15 }}
              />

            <View>
              <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>
                {currentDistance} m
              </Text>
              <Text style={{ color: '#fff', fontSize: 18 }}>{currentInstruction}</Text>
            </View>
          </View>
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
                    <Text style={styles.speedTextNumber}>{Math.round(speed || 0)}</Text>
                    <Text style={styles.speedTextLetter}>km/h</Text>
                  </View>


                  <Text style={[styles.selectedRouteText, { color: textColor }]}>
                    {((selectedRoute.summary.travelTimeInSeconds) / 60).toFixed(0)} min
                  </Text>

                  <TouchableOpacity style={styles.clearRouteButton} onPress={clearRoute}>
                    <Image source={require('@assets/images/close.png')} style={styles.closeBtn}/>
                  </TouchableOpacity>

                </View> 
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
    height: 160,
    width: '100%',
    zIndex: 10,
    backgroundColor:'rgb(0, 0, 0)',
    borderRadius:25,
    paddingTop:75,

  },
  roadInstruction:{
    flexDirection:'row',
    marginLeft:15,
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
    width: 60,
    height: 60,
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
  speedTextNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  speedTextLetter: {
    fontSize: 12,
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
  closeBtn:{
    height:20,
    width:20,
  },
});
