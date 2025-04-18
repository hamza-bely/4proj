import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

interface TomTomMapProps {
  destination?: { latitude: number; longitude: number } | null;
  routeOptions?: any[]; // Ajoutez routeOptions ici
  selectedRoute?: any; // Ajoutez selectedRoute ici
}

export default function TomTomMap({ destination, routeOptions, selectedRoute }: TomTomMapProps) {
  const webviewRef = useRef<WebView | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
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
        let map, userMarker, destMarker;
        let userCoords = [${location.longitude}, ${location.latitude}];
        const colors = ['#28a745', '#ff5733', '#337eff']; // Couleurs pour les itinéraires

        tt.setProductInfo('DelonApp', '1.0');

        map = tt.map({
          key: 'QBsKzG3zoRyZeec28eUDje0U8DeNoRSO',
          container: 'map',
          center: userCoords,
          zoom: 17,
          pitch: 100,
          dragRotate: true,
        });

        map.addControl(new tt.FullscreenControl());

        userMarker = new tt.Marker().setLngLat(userCoords).addTo(map);

        window.updateUserLocation = (lng, lat) => {
          userCoords = [lng, lat];
          userMarker.setLngLat(userCoords);
          map.setCenter(userCoords);
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

              // Supprimer ancienne route si existante
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

              // Ajouter ou mettre à jour le marqueur de destination
              if (destMarker) {
                destMarker.setLngLat(destCoords);
              } else {
                destMarker = new tt.Marker({ color: 'red' }).setLngLat(destCoords).addTo(map);
              }
            })
            .catch(err => {
              console.error("Erreur lors du calcul de l'itinéraire :", err);
              alert("Erreur lors du calcul de l'itinéraire.");
            });
        };

        window.displayAllRoutes = function(routes) {
          routes.forEach((route, index) => {
            const points = route.legs[0].points.map(p => [p.longitude, p.latitude]);
            const color = colors[index % colors.length]; // Utiliser une couleur différente pour chaque itinéraire

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
          const color = '#ffd700'; // Couleur pour l'itinéraire sélectionné

          // Supprimer anciennes routes
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

          // Ajouter ou mettre à jour le marqueur de destination
          const destCoords = [route.legs[0].points[route.legs[0].points.length - 1].longitude, route.legs[0].points[route.legs[0].points.length - 1].latitude];
          if (destMarker) {
            destMarker.setLngLat(destCoords);
          } else {
            destMarker = new tt.Marker({ color: 'red' }).setLngLat(destCoords).addTo(map);
          }
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
