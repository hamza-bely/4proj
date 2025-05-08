import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, } from 'react-native';
import { WebView } from 'react-native-webview';
import { DeviceMotion } from 'expo-sensors';
import { useLocation } from '@hooks/useLocation';
import ReportData from '@interfaces/ReportData';
import { ReportType } from '@core/types';
import { tomtomInjectedFunctions } from '@hooks/injectedScript';
import { fetchReports } from '@services/apiService';
import { Image } from 'react-native';
import TomTomMapProps from '@interfaces/TomTomMapProps';

const EXPO_PUBLIC_TOMTOM_API_KEY = process.env.EXPO_PUBLIC_TOMTOM_API_KEY;

const reportIcons: Record<ReportType, any> = {
  TRAFFIC:       require('@/assets/images/traffic.png'),
  POLICE_CHECKS: require('@/assets/images/police.png'),
  ACCIDENTS:     require('@/assets/images/crash.png'),
  OBSTACLES:     require('@/assets/images/danger.png'),
  ROADS_CLOSED:  require('@/assets/images/roads_closed.png'),
};

export default function TomTomMap({destination, routeOptions, selectedRoute}: TomTomMapProps) {
  
  const webviewRef = useRef<WebView | null>(null);
  const { location, error } = useLocation();
  const [reports, setReports] = useState<ReportData[]>([]);


  const handleWebViewLoad = () => {
    webviewRef.current?.injectJavaScript(tomtomInjectedFunctions);
    fetchReports().then(fetched => {
      setReports(fetched);
      fetched.forEach(report => {
        const asset = Image.resolveAssetSource(reportIcons[report.type]);
        const js = `
          if (window.addReportMarker) {
            addReportMarker(${report.longitude}, ${report.latitude}, "${asset.uri}");
          }
        `;
        webviewRef.current?.injectJavaScript(js);
      });
    }).catch(err => console.error('fetchReports error', err));
  };

  useEffect(() => {
    const subscription = DeviceMotion.addListener(({ rotation }) => {
      const alpha = rotation.alpha;
      if (location) {
        const js = `
          if (window.updateUserLocation) {
            updateUserLocation(${location.longitude}, ${location.latitude}, ${alpha});
          }
        `;
        webviewRef.current?.injectJavaScript(js);
      }
    });
    DeviceMotion.setUpdateInterval(100);
    return () => subscription.remove();
  }, [location]);


  useEffect(() => {
    if (!location || !destination) return;
  
    const js = `
      if (window.searchAndRoute) {
        searchAndRoute('${destination.latitude},${destination.longitude}');
      }
    `;
    webviewRef.current?.injectJavaScript(js);
  }, [location, destination]);


  useEffect(() => {
    if (!routeOptions?.length) return;
  
    const routesJson = JSON.stringify(routeOptions);
    const js = `
      if (window.displayAllRoutes) {
        displayAllRoutes(${routesJson});
      }
    `;
    webviewRef.current?.injectJavaScript(js);
  }, [routeOptions]);


  useEffect(() => {
    if (!selectedRoute) {

      webviewRef.current?.injectJavaScript(`
        if (window.clearRoute) clearRoute();
      `);
      return;
    }
    const selectedJson = JSON.stringify(selectedRoute);
    webviewRef.current?.injectJavaScript(`
      if (window.highlightSelectedRoute) {
        highlightSelectedRoute(${selectedJson});
      }
    `);
  }, [selectedRoute]);
  
  
  

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
      <script src="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.19.0/maps/maps-web.min.js"></script>
      <script src="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.19.0/services/services-web.min.js"></script>
      <link rel="stylesheet" href="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.19.0/maps/maps.css"/>
      <style>html, body, #map { margin:0; padding:0; height:100%; width:100%; }</style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const defaultCoords = [0, 0];
        tt.setProductInfo('DelonApp', '1.0');
        const map = tt.map({
          key: '${EXPO_PUBLIC_TOMTOM_API_KEY}',
          container: 'map',
          center: defaultCoords,
          zoom: 17,
          pitch: 40,
          bearingSnap: 7,
        });
        map.addControl(new tt.FullscreenControl());


        let userCoords = defaultCoords;
        let userMarker = null;
        let userIconInner = null;
        function createUserMarker() {
          const icon = document.createElement('div');
          icon.style.width = '40px'; icon.style.height = '40px';
          const inner = document.createElement('div');
          inner.style.width = '100%'; inner.style.height = '100%';
          inner.style.backgroundImage = 'url(https://img.icons8.com/?size=100&id=HZC1E42sHiI3&format=png&color=000000)';
          inner.style.backgroundSize = 'contain'; inner.style.transition = 'transform 0.5s ease';
          icon.appendChild(inner);
          userIconInner = inner;
          userMarker = new tt.Marker({ element: icon }).setLngLat(userCoords).addTo(map);
        }
        createUserMarker();

        let destMarker = null;
      </script>
    </body>
    </html>
  `;

  if (error || !location) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        onLoadEnd={handleWebViewLoad}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
