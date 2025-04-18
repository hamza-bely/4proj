import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

interface TomTomMapProps {
  destination?: { latitude: number; longitude: number } | null;
}

export default function TomTomMap({ destination }: TomTomMapProps) {
  const webviewRef = useRef<WebView | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);


  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission GPS refusée.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);


  useEffect(() => {
    const watch = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 2000,
        distanceInterval: 2,
      },
      (loc) => {
        const coords = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
        setLocation(coords);
        webviewRef.current?.injectJavaScript(`
          if (window.updateUserLocation) {
            updateUserLocation(${coords.longitude}, ${coords.latitude});
          }
        `);
      }
    );

    return () => {
      watch.then((subscription) => subscription.remove());
    };
  }, []);

  useEffect(() => {
    if (destination && location) {
      webviewRef.current?.injectJavaScript(`
        if (window.searchAndRoute) {
          searchAndRoute('${destination.latitude},${destination.longitude}');
        }
      `);
    }
  }, [destination, location]);

  if (!location) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Chargement de la position...</Text>
      </View>
    );
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
      <script src="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.19.0/maps/maps-web.min.js"></script>
      <script src="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.19.0/services/services-web.min.js"></script>
      <link rel="stylesheet" href="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.19.0/maps/maps.css"/>
      <style>
        html, body, #map { margin: 0; padding: 0; height: 100%; width: 100%; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        let map, userMarker, routeLayer;

        tt.setProductInfo('DelonApp', '1.0');

        const userCoords = [${location.longitude}, ${location.latitude}];

        map = tt.map({
          key: 'QBsKzG3zoRyZeec28eUDje0U8DeNoRSO',
          container: 'map',
          center: userCoords,
          zoom: 17,
          pitch: 100,
          dragRotate: true,
        });

        userMarker = new tt.Marker().setLngLat(userCoords).addTo(map);

        window.updateUserLocation = (lng, lat) => {
          const newPos = [lng, lat];
          userMarker.setLngLat(newPos);
          map.setCenter(newPos);
        };

        window.searchAndRoute = function(coords) {
          const [lat, lon] = coords.split(',').map(Number);
          const destCoords = [lon, lat];

          fetch(\`https://api.tomtom.com/routing/1/calculateRoute/\${userCoords[1]},\${userCoords[0]}:\${lat},\${lon}/json?key=QBsKzG3zoRyZeec28eUDje0U8DeNoRSO\`)
            .then(res => res.json())
            .then(routeData => {
              const points = routeData.routes[0].legs[0].points.map(p => [p.longitude, p.latitude]);

              if (routeLayer) {
                map.removeLayer('route');
                map.removeSource('route');
              }

              map.addLayer({
                id: 'route',
                type: 'line',
                source: {
                  type: 'geojson',
                  data: {
                    type: 'Feature',
                    geometry: {
                      type: 'LineString',
                      coordinates: points
                    }
                  }
                },
                paint: {
                  'line-color': '#28a745',
                  'line-width': 6
                }
              });

              routeLayer = true;
            });
        };
      </script>
    </body>
    </html>
  `;

  return (
    <WebView
      ref={webviewRef}
      originWhitelist={['*']}
      source={{ html: htmlContent }}
      javaScriptEnabled
      domStorageEnabled
      style={{ flex: 1 }}
    />
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
