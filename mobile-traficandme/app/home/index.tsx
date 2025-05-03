import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { router } from 'expo-router';
import { KeyboardAvoidingView, Keyboard, Platform, StyleSheet, TextInput, View, useColorScheme, Text, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import * as ExpoLocation from 'expo-location';
import TomTomMap from '@components/TomTomMaps';
import ReportModal from '@components/reportModal';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import AddressSuggestion from '@interfaces/AddressSuggestion';
import NavigationInstruction from '@interfaces/NavigationInstruction';
import RouteOption from '@interfaces/RouteOption';
import ClosestInstruction from '@interfaces/ClosestInstruction';
import { getDistanceFromLatLonInM } from '@utils/distance';
import { fetchSuggestions, fetchRouteOption } from '@services/apiService';
import { useLocation } from '@hooks/useLocation';
import getInstructionIcon from '@utils/getInstructionIcon';
import { styles } from './styles';
import ReportData from '@interfaces/ReportData';

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
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const [currentInstruction, setCurrentInstruction] = useState<string | null>(null);
  const [currentDistance, setCurrentDistance] = useState<number>(0);
  const [currentManeuver, setCurrentManeuver] = useState<string>('STRAIGHT');
  const [instructions, setInstructions] = useState<NavigationInstruction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const OpenMenu = () => { router.push('/home/menu') }
  const [modalVisible, setModalVisible] = useState(false);
  const { location, error } = useLocation();
  const [userPosition, setUserPosition] = useState<{ latitude: number; longitude: number } | null>(location);
  const [activeAlert, setActiveAlert] = useState<ReportData | null>(null);
  const [shownAlerts, setShownAlerts] = useState<Set<string>>(new Set());
  const [reports, setReports] = useState<ReportData[]>([]); // Ajout de l'état pour les rapports
  const [reportIndex, setReportIndex] = useState(0); // Ajout de l'état pour l'index du rapport actuel

  const EXPO_PUBLIC_TOMTOM_API_KEY = process.env.EXPO_PUBLIC_TOMTOM_API_KEY;

  useEffect(() => {
    if (searchText.length > 2) {
      fetchSuggestions(searchText).then(setSuggestions).catch(console.error);
    } else {
      setSuggestions([]);
    }
  }, [searchText]);

  useEffect(() => {
    if (location) {
      setUserPosition(location);
    }
  }, [location]);

  useEffect(() => {
    if (destination) {
      setLoading(true);
      fetchRouteOption(destination)
        .then((routes) => {
          setRouteOptions(routes);
          if (routes.length > 0) {
            const instructionsArray: NavigationInstruction[] = routes[0].guidance.instructions.map((instr: any) => ({
              message: instr.message,
              distance: instr.routeOffsetInMeters,
              maneuver: instr.maneuver,
            }));
            setInstructions(instructionsArray);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [destination]);

  useEffect(() => {
    const watchPosition = async () => {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission GPS refusée.');
        return;
      }

      const subscription = ExpoLocation.watchPositionAsync(
        {
          accuracy: ExpoLocation.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 5,
        },
        (location) => {
          setSpeed(location.coords.speed);
          setUserPosition({ latitude: location.coords.latitude, longitude: location.coords.longitude });
          updateCurrentInstruction(location.coords);
        }
      );

      return () => subscription.then((sub) => sub.remove());
    };

    watchPosition();
  }, [selectedRoute]);

  const updateCurrentInstruction = useCallback(async (coords: ExpoLocation.LocationObjectCoords) => {
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

    if (minDistance > 50) {
      await recalculateRoute(coords);
    }
  }, [selectedRoute]);

  const recalculateRoute = async (coords: ExpoLocation.LocationObjectCoords) => {
    if (!destination) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.tomtom.com/routing/1/calculateRoute/${coords.latitude},${coords.longitude}:${destination.latitude},${destination.longitude}/json?key=${EXPO_PUBLIC_TOMTOM_API_KEY}&routeType=fastest&maxAlternatives=3&instructionsType=text&language=fr`
      );
      const data = await response.json();

      if (data.routes.length > 0) {
        const instructionsArray: NavigationInstruction[] = data.routes[0].guidance.instructions.map((instr: any) => ({
          message: instr.message,
          distance: instr.routeOffsetInMeters,
          maneuver: instr.maneuver,
        }));

        setRouteOptions(data.routes);
        setInstructions(instructionsArray);
        setSelectedRoute(data.routes[0]);
      }
    } catch (error) {
      console.error('Erreur lors du recalcul de l\'itinéraire :', error);
    } finally {
      setLoading(false);
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

  const memoizedTomTomMap = useMemo(() => (
    <TomTomMap destination={destination} routeOptions={routeOptions} selectedRoute={selectedRoute} />
  ), [destination, routeOptions, selectedRoute]);

  // Ajout de l'effet pour mettre à jour l'affichage des rapports
  useEffect(() => {
    if (reports.length > 0 && userPosition) {
      const interval = setInterval(() => {
        setReportIndex((prevIndex) => (prevIndex + 1) % reports.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [reports, userPosition]);

  useEffect(() => {
    if (reports.length > 0) {
      setActiveAlert(reports[reportIndex]);
    }
  }, [reportIndex, reports]);

  const getReportDistance = (report: ReportData): number | null => {
    if (userPosition && report) {
      return getDistanceFromLatLonInM(userPosition.latitude, userPosition.longitude, report.latitude, report.longitude);
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <ReportModal visible={modalVisible} onClose={() => setModalVisible(false)} />
      <StatusBar style="light" translucent backgroundColor="transparent" />

      {memoizedTomTomMap}

      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientOverlay}
      />

      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Chargement...</Text>
        </View>
      )}

      {selectedRoute && instructions.length > 0 && (
        <View style={styles.roadInstructionContainer}>
          {selectedAddress && (<Text style={styles.titleDest}>{selectedAddress.address.freeformAddress}</Text>)}

          {currentInstruction && currentDistance > 0 && (
            <View style={styles.roadInstruction}>
              <Image
                source={getInstructionIcon(currentManeuver)}
                style={{ width: 50, height: 50, tintColor: '#00bfff', marginRight: 15 }}
              />

              <View>
                <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>
                  {currentDistance} m
                </Text>
                <Text style={{ color: '#fff', fontSize: 18 }}>{currentInstruction}</Text>
              </View>
            </View>
          )}

          {activeAlert && (
            <View style={styles.reportAlert}>
              <Image
                source={getInstructionIcon(activeAlert.type)} // Assurez-vous d'avoir une fonction pour obtenir l'icône du rapport
                style={{ width: 50, height: 50, tintColor: '#ff0000', marginRight: 15 }}
              />
              <View>
                <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>
                  {getReportDistance(activeAlert)} m
                </Text>
                <Text style={{ color: '#fff', fontSize: 18 }}>{activeAlert.name}</Text>
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
              <TouchableOpacity onPress={OpenMenu} style={[styles.addressBlockA, ]}><Image style={styles.iconImg} source={require('@assets/images/menu-96.png')}></Image></TouchableOpacity>
              <TouchableOpacity style={[styles.addressBlock, { borderColor }]}><Text style={[styles.myAddressText, { color: textColor }]}>Ajouter</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.addressBlockC, ]}><Image style={styles.iconImg} source={require('@assets/images/erreur-96.png')}></Image></TouchableOpacity>
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
                <View style={styles.ButtonContainer}>
                  <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.iconImgContainerRouteInfo} ><Image style={styles.iconImg} source={require('@assets/images/qr-code.png')}></Image></TouchableOpacity>
                  <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.iconImgContainerRouteInfo}><Image style={styles.iconImg} source={require('@assets/images/erreur-96.png')}></Image></TouchableOpacity>
                </View>
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


