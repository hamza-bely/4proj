import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
  useColorScheme,
  Text,
  TouchableOpacity,
  FlatList,
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
          timeInterval: 1000, // Mettre à jour toutes les secondes
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
      fetchTravelTime(destination);
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

  const fetchTravelTime = async (destination: { latitude: number; longitude: number }) => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const response = await fetch(`https://api.tomtom.com/routing/1/calculateRoute/${latitude},${longitude}:${destination.latitude},${destination.longitude}/json?key=QBsKzG3zoRyZeec28eUDje0U8DeNoRSO`);
      const data = await response.json();
      const travelTimeInSeconds = data.routes[0].summary.travelTimeInSeconds;
      setTravelTime(travelTimeInSeconds / 60); // Convertir en minutes
    } catch (error) {
      console.error('Erreur lors de la récupération du temps de trajet :', error);
    }
  };

  const handleSelectAddress = (address: AddressSuggestion) => {
    setSearchText(address.address.freeformAddress);
    setSelectedAddress(address);
    setSuggestions([]);
    const { lat, lon } = address.position;
    setDestination({ latitude: lat, longitude: lon });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />

      <TomTomMap destination={destination} />

      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientOverlay}
      />

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
          <View style={styles.routeInfoContainer}>
            <View style={styles.routeInfoRowA}>
              <View style={styles.speed}>
                <Text style={styles.speedText}>{(speed || 0)}</Text>
                <Text style={styles.speedText}>km/h</Text>
              </View>
              <Text style={[styles.routeInfoTime, { color: textColor }]}>{travelTime !== null ? `${travelTime.toFixed(0)} min` : ''}</Text>
              <TouchableOpacity style={styles.clearRouteButton} onPress={() => setDestination(null)}>
                <Text style={styles.clearRouteButtonText}>x</Text>
              </TouchableOpacity>
            </View>
            {/* <Text style={[styles.routeInfoText, { color: textColor }]}>Itinéraire vers : {selectedAddress?.address.freeformAddress}</Text> */}
          </View>
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
    justifyContent:'center',
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
  routeInfoText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  routeInfoTime:{
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
