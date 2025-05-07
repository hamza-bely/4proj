import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Location from 'expo-location';
import { Alert, Platform } from 'react-native';

interface LocationState {
  location: Location.LocationObject | null;
  errorMsg: string | null;
  loading: boolean;
}

interface LocationContextData {
  state: LocationState;
  requestLocationPermission: () => Promise<void>;
  getCurrentLocation: () => Promise<Location.LocationObject | null>;
}

const LocationContext = createContext<LocationContextData>({} as LocationContextData);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<LocationState>({
    location: null,
    errorMsg: null,
    loading: true,
  });

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        await requestLocationPermission();
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    })();
  }, []);

  const requestLocationPermission = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setState({
          location: null,
          errorMsg: 'Permission to access location was denied',
          loading: false,
        });
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setState({
        location,
        errorMsg: null,
        loading: false,
      });
    } catch (error) {
      setState({
        location: null,
        errorMsg: 'Error getting location',
        loading: false,
      });
      console.error('Error getting location:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'Please enable location services to use this feature',
          [{ text: 'OK', onPress: requestLocationPermission }]
        );
        return null;
      }
      
      const location = await Location.getCurrentPositionAsync({});
      setState(prev => ({ ...prev, location }));
      return location;
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  };

  return (
    <LocationContext.Provider value={{ state, requestLocationPermission, getCurrentLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};