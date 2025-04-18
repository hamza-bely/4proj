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

  useEffect(() => {
    if (searchText.length > 2) {
      fetchSuggestions(searchText);
    } else {
      setSuggestions([]);
    }
  }, [searchText]);

  const fetchSuggestions = async (text: string) => {
    try {
      const response = await fetch(`https://api.tomtom.com/search/2/search/${encodeURIComponent(text)}.json?key=QBsKzG3zoRyZeec28eUDje0U8DeNoRSO&typeahead=true&limit=5`);
      const data = await response.json();
      setSuggestions(data.results);
    } catch (error) {
      console.error('Erreur lors de la récupération des suggestions :', error);
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
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Recherche..."
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
});
