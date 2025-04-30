import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocation } from '@hooks/useLocation';
import { DeviceMotion } from 'expo-sensors';
import TomTomMapProps from '@interfaces/TomTomMapProps';
import { tomtomInjectedFunctions } from '@hooks/injectedScript';


export default function TomTomMap({ destination, routeOptions, selectedRoute, userPosition }: TomTomMapProps) {
  
  const webviewRef = useRef<WebView | null>(null);
  const { location, error } = useLocation();
  const [orientation, setOrientation] = useState<number>(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      webviewRef.current?.injectJavaScript(tomtomInjectedFunctions);
    }, 2000);
  
    return () => clearTimeout(timeout);
  }, [location]);

  useEffect(() => {
    const subscription = DeviceMotion.addListener(({ rotation }) => {
      const { alpha } = rotation;
      setOrientation(alpha);
      if (location) {
        webviewRef.current?.injectJavaScript(`
          if (window.updateUserLocation) {
            updateUserLocation(${location.longitude}, ${location.latitude}, ${alpha});
          }
        `);
      }
    });

    DeviceMotion.setUpdateInterval(100);
    return () => subscription.remove();
  }, [location]);

  const updateRoute = useCallback(() => {
    if (destination && location) {
      webviewRef.current?.injectJavaScript(`
        if (window.searchAndRoute) {
          searchAndRoute('${destination.latitude},${destination.longitude}');
        }
      `);
    }
  }, [destination, location]);

  useEffect(() => {
    updateRoute();
  }, [updateRoute]);

  useEffect(() => {
    if (routeOptions?.length) {
      webviewRef.current?.injectJavaScript(`
        if (window.displayAllRoutes) {
          displayAllRoutes(${JSON.stringify(routeOptions)});
        }
      `);
    }
  }, [routeOptions]);

  useEffect(() => {
    if (selectedRoute) {
      webviewRef.current?.injectJavaScript(`
        if (window.highlightSelectedRoute) {
          highlightSelectedRoute(${JSON.stringify(selectedRoute)});
        }
      `);
    } else {
      webviewRef.current?.injectJavaScript(`
        if (window.clearRoute) {
          clearRoute();
        }
      `);
    }
  }, [selectedRoute]);

  const htmlContent = useMemo(() => {
    if (!location) return '';

    return `
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
          let map, userMarker, destMarker;
          let userCoords = [${location.longitude}, ${location.latitude}];

          tt.setProductInfo('DelonApp', '1.0');

          map = tt.map({
            key: 'QBsKzG3zoRyZeec28eUDje0U8DeNoRSO',
            container: 'map',
            center: userCoords,
            zoom: 18,
            pitch: 100,
            dragRotate: true,
            bearingSnap: 7,
          });

          map.addControl(new tt.FullscreenControl());

          const userIcon = document.createElement('div');
          userIcon.style.width = '40px';
          userIcon.style.height = '40px';
          userIcon.style.display = 'flex';
          userIcon.style.justifyContent = 'center';
          userIcon.style.alignItems = 'center';

          const userIconInner = document.createElement('div');
          userIconInner.style.width = '100%';
          userIconInner.style.height = '100%';
          userIconInner.style.backgroundImage = 'url(https://img.icons8.com/?size=100&id=HZC1E42sHiI3&format=png&color=000000)';
          userIconInner.style.backgroundSize = 'contain';
          userIconInner.style.backgroundRepeat = 'no-repeat';
          userIconInner.style.transition = 'transform 0.5s ease';
          userIconInner.style.transform = 'rotate(0deg)';

          userIcon.appendChild(userIconInner);
          userMarker = new tt.Marker({ element: userIcon }).setLngLat(userCoords).addTo(map);
        </script>
      </body>
      </html>
    `;
  }, [location]);

  if (!location) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Chargement de la position...</Text>
      </View>
    );
  }

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
