import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

export default function TomTomMap() {
  const webviewRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission GPS refusée.');
        return;
      }
    })();
  }, []);

  const centerOnUserLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    // Envoie les coordonnées à la WebView pour recenter
    const script = `centerMapOn(${longitude}, ${latitude}); true;`;
    webviewRef.current?.injectJavaScript(script);
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script src="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.19.0/maps/maps-web.min.js"></script>
      <script src="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.19.0/services/services-web.min.js"></script>
      <link rel="stylesheet" href="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.19.0/maps/maps.css" />
      <style>
        html, body, #map {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        tt.setProductInfo('DelonApp', '1.0');

        const map = tt.map({
          key: 'QBsKzG3zoRyZeec28eUDje0U8DeNoRSO'
          container: 'map',
          center: [4.8357, 45.7640],
          zoom: 15.5,
          pitch: 65,
          bearing: 45,
          style: 'tomtom://vector/1/basic-main'
        });

        map.addControl(new tt.FullscreenControl());
        map.addControl(new tt.NavigationControl());

        map.on('load', () => {
          map.addLayer({
            id: '3d-buildings',
            source: 'composite',
            'source-layer': 'building',
            filter: ['==', 'extrude', 'true'],
            type: 'fill-extrusion',
            minzoom: 14,
            paint: {
              'fill-extrusion-color': '#aaa',
              'fill-extrusion-height': ['get', 'height'],
              'fill-extrusion-base': ['get', 'min_height'],
              'fill-extrusion-opacity': 0.6
            }
          });
        });

        function centerMapOn(lon, lat) {
          map.flyTo({
            center: [lon, lat],
            zoom: 17,
            speed: 1.2,
            curve: 1.5,
            pitch: 65,
            bearing: 0
          });
        }
      </script>
    </body>
    </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="always"
        style={{ flex: 1 }}
      />


      <TouchableOpacity onPress={centerOnUserLocation} style={styles.gpsButton}>
        <Text style={styles.gpsButtonText}>📍</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  gpsButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  gpsButtonText: {
    fontSize: 20,
  },
});
