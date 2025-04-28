import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export default function useLocationTracking(onLocationChange: (coords: Location.LocationObjectCoords) => void) {
  const [speed, setSpeed] = useState<number | null>(null);
  const [userPosition, setUserPosition] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    let subscription: any;

    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 5 },
        ({ coords }) => {
          setSpeed(coords.speed ?? 0);
          setUserPosition({ latitude: coords.latitude, longitude: coords.longitude });
          onLocationChange(coords);
        }
      );
    };

    startTracking();

    return () => {
      subscription?.remove();
    };
  }, [onLocationChange]);

  return { speed, userPosition };
}
