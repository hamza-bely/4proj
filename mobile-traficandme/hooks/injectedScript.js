

const EXPO_PUBLIC_TOMTOM_API_KEY = process.env.EXPO_PUBLIC_TOMTOM_API_KEY;

export const tomtomInjectedFunctions = `
    window.updateUserLocation = function(lng, lat, heading) {
        userCoords = [lng, lat];
        if (userMarker) {
        userMarker.setLngLat(userCoords);
        }
        if (userIconInner) {
        userIconInner.style.transform = 'rotate(' + heading + 'deg)';
        }
        map.setCenter(userCoords);
        map.rotateTo(heading, { duration: 500 });
    };

    window.searchAndRoute = function(coords) {
        const [lat, lon] = coords.split(',').map(Number);
        const destCoords = [lon, lat];
        fetch('https://api.tomtom.com/routing/1/calculateRoute/' + userCoords[1] + ',' + userCoords[0] + ':' + lat + ',' + lon + '/json?key=${EXPO_PUBLIC_TOMTOM_API_KEY}&routeType=fastest&maxAlternatives=3')
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
        .catch(err => console.error("Erreur lors du calcul de l'itinéraire :", err));
    };

    window.displayAllRoutes = function(routes) {
        const colors = ['#28a745', '#ff5733', '#337eff'];
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

        for (let i = 0; i < 3; i++) {
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
            'line-color': '#ffd700',
            'line-width': 6
        }
        });

        const destCoords = [route.legs[0].points.at(-1).longitude, route.legs[0].points.at(-1).latitude];
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
        for (let i = 0; i < 3; i++) {
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


    window.addReportMarker = function(lng, lat, iconUrl) {
    const el = document.createElement('img');
    el.src = iconUrl;
    el.style.width = '40px';
    el.style.height = '40px';
    el.style.objectFit = 'contain';


    new tt.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(map);
    };
`;
