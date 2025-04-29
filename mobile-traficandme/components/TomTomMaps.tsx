import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocation } from '@hooks/useLocation';
import { DeviceMotion } from 'expo-sensors';
import TomTomMapProps from '@interfaces/TomTomMapProps';

export default function TomTomMap({ destination, routeOptions, selectedRoute, userPosition }: TomTomMapProps) {
  const webviewRef = useRef<WebView | null>(null);
  const { location, error } = useLocation();
  const [orientation, setOrientation] = useState<number>(0);

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

    return () => {
      subscription.remove();
    };
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
    if (routeOptions && routeOptions.length > 0) {
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
    }
  }, [selectedRoute]);

  useEffect(() => {
    if (selectedRoute === null) {
      webviewRef.current?.injectJavaScript(`
        if (window.clearRoute) {
          window.clearRoute();
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
          const colors = ['#28a745', '#ff5733', '#337eff']; // Couleurs pour les itinéraires

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

          window.updateUserLocation = (lng, lat, heading) => {
            console.log(\`Updating user location: lng=\${lng}, lat=\${lat}, heading=\${heading}\`);
            userCoords = [lng, lat];
            userMarker.setLngLat(userCoords);
            userIconInner.style.transform = \`rotate(\${heading}deg)\`;
            map.setCenter(userCoords);
            map.rotateTo(heading, { duration: 500 });
          };


          window.searchAndRoute = function(coords) {
            const [lat, lon] = coords.split(',').map(Number);
            const destCoords = [lon, lat];

            fetch(\`https://api.tomtom.com/routing/1/calculateRoute/\${userCoords[1]},\${userCoords[0]}:\${lat},\${lon}/json?key=QBsKzG3zoRyZeec28eUDje0U8DeNoRSO&routeType=fastest&maxAlternatives=3\`)
              .then(res => res.json())
              .then(routeData => {
                if (!routeData.routes || routeData.routes.length === 0) {
                  alert("Aucune route trouvée.");
                  return;
                }

                const points = routeData.routes[0].legs[0].points.map(p => [p.longitude, p.latitude]);

                if (map.getLayer('route')) {
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

                if (destMarker) {
                  destMarker.setLngLat(destCoords);
                } else {
                  destMarker = new tt.Marker({ color: 'red' }).setLngLat(destCoords).addTo(map);
                }
              })
              .catch(err => {
                console.error("Erreur lors du calcul de l'itinéraire :", err);
              });
          };

          window.displayAllRoutes = function(routes) {
            routes.forEach((route, index) => {
              const points = route.legs[0].points.map(p => [p.longitude, p.latitude]);
              const color = colors[index % colors.length];

              map.addLayer({
                id: 'route-' + index,
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
                  'line-color': color,
                  'line-width': 6
                }
              });
            });
          };

          window.highlightSelectedRoute = function(route) {
            const points = route.legs[0].points.map(p => [p.longitude, p.latitude]);
            const color = '#ffd700';

            for (let i = 0; i < colors.length; i++) {
              if (map.getLayer('route-' + i)) {
                map.removeLayer('route-' + i);
                map.removeSource('route-' + i);
              }
            }

            map.addLayer({
              id: 'selected-route',
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
                'line-color': color,
                'line-width': 6
              }
            });

            const destCoords = [route.legs[0].points[route.legs[0].points.length - 1].longitude, route.legs[0].points[route.legs[0].points.length - 1].latitude];
            if (destMarker) {
              destMarker.setLngLat(destCoords);
            } else {
              destMarker = new tt.Marker({ color: 'red' }).setLngLat(destCoords).addTo(map);
            }
          };

          window.clearRoute = function() {
            if (map.getLayer('route')) {
              map.removeLayer('route');
              map.removeSource('route');
            }
            if (map.getLayer('selected-route')) {
              map.removeLayer('selected-route');
              map.removeSource('selected-route');
            }
            for (let i = 0; i < colors.length; i++) {
              if (map.getLayer('route-' + i)) {
                map.removeLayer('route-' + i);
                map.removeSource('route-' + i);
              }
            }
            if (destMarker) {
              destMarker.remove();
              destMarker = null;
            }
          };
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
