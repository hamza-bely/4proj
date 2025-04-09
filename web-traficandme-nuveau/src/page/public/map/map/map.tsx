import React, { useEffect, useRef, useState } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import ContainerMap from "../container-map.tsx";
import Markers from "../markers/markers.tsx";
import "../css/map.css";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

type Coordinate = {
    lat: number;
    lon: number;
};

type RouteResponse = {
    routes: Array<{
        summary: {
            lengthInMeters: number;
            travelTimeInSeconds: number;
            trafficDelayInSeconds: number;
        };
        legs: Array<{
            points: Array<{
                latitude: number;
                longitude: number;
            }>;
        }>;
    }>;
};

const Map: React.FC = () => {
    const mapElement = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<tt.Map | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const apiKey = import.meta.env.VITE_TOMTOM_API_KEY;
    const time: number = 90000000;
    const location = useLocation();
    let markers: tt.Marker[] = [];

    // Récupérer tous les paramètres de l'URL
    const searchParams = new URLSearchParams(location.search);
    const urlLat = searchParams.get('lat');
    const urlLng = searchParams.get('lng');

    // Paramètres pour l'itinéraire
    const startLat = searchParams.get('startLat');
    const startLon = searchParams.get('startLon');
    const endLat = searchParams.get('endLat');
    const endLon = searchParams.get('endLon');
    const mode = searchParams.get('mode');
    const peage = searchParams.get('peage') === 'true';
    //const routeId = searchParams.get('routeId');

    const defaultCenter: [number, number] = [2.3522, 48.8566];

    useEffect(() => {
        if (!mapElement.current) return;
        if (map) map.remove();

        let center: [number, number];
        let zoom: number;

        // Priorité à l'itinéraire si les paramètres sont présents
        if (startLat && startLon && endLat && endLon) {
            // Centrer sur le point de départ
            center = [parseFloat(startLon), parseFloat(startLat)];
            zoom = 12;
        } else if (urlLat && urlLng) {
            // Sinon, utiliser les paramètres lat/lng classiques
            center = [parseFloat(urlLng), parseFloat(urlLat)];
            zoom = 18;
        } else {
            // Par défaut
            center = defaultCenter;
            zoom = 12;
        }

        const mapInstance = tt.map({
            key: apiKey,
            container: mapElement.current,
            center: center,
            zoom: zoom,
        });

        setMap(mapInstance);

        mapInstance.on("load", () => {
            enableTrafficLayer(mapInstance);

            // Si on a les paramètres d'itinéraire, calculer et afficher l'itinéraire
            if (startLat && startLon && endLat && endLon) {
                calculateRouteFromParams(
                    { lat: parseFloat(startLat), lon: parseFloat(startLon) },
                    { lat: parseFloat(endLat), lon: parseFloat(endLon) },
                    mode === 'Rapide' ? 'fastest' : 'shortest',
                    !peage,
                    mapInstance
                );
            }

            const incidentInterval = setInterval(() => {
                markers.forEach(marker => marker.remove());
                markers = [];
            }, 300000);

            const trafficInterval = setInterval(() => {
                if (mapInstance.getSource("traffic-source")) {
                    mapInstance.removeLayer("traffic-layer");
                    mapInstance.removeSource("traffic-source");
                }
                enableTrafficLayer(mapInstance);
            }, time);

            return () => {
                clearInterval(incidentInterval);
                clearInterval(trafficInterval);
            };
        });

        return () => {
            if (mapInstance) mapInstance.remove();
        };
    }, [apiKey, location.search]);

    function enableTrafficLayer(mapInstance: tt.Map) {
        if (!mapInstance) return;

        if (!mapInstance.getSource("traffic-source")) {
            mapInstance.addSource("traffic-source", {
                type: "raster",
                tiles: [
                    `https://api.tomtom.com/traffic/map/4/tile/flow/relative0/{z}/{x}/{y}.png?key=${apiKey}`
                ],
                tileSize: 256
            });

            mapInstance.addLayer({
                id: "traffic-layer",
                type: "raster",
                source: "traffic-source",
                layout: {
                    visibility: "visible"
                }
            });
        }
    }

    const calculateRouteFromParams = async (
        startCoord: Coordinate,
        endCoord: Coordinate,
        routeType: "fastest" | "shortest",
        avoidTolls: boolean,
        mapInstance: tt.Map
    ) => {
        setIsLoading(true);
        try {
            const avoid = avoidTolls ? "&avoid=tollRoads" : "";
            const url = `https://api.tomtom.com/routing/1/calculateRoute/${startCoord.lat},${startCoord.lon}:${endCoord.lat},${endCoord.lon}/json?key=${apiKey}&routeType=${routeType}${avoid}`;

            const response = await fetch(url);
            const data: RouteResponse = await response.json();

            if (data.routes.length > 0 && data.routes[0].legs.length > 0) {
                const route = data.routes[0];
                const points = route.legs[0].points;
                const coordinates = points.map((p) => [p.longitude, p.latitude] as [number, number]);

                // Afficher l'itinéraire sur la carte
                displayRouteOnMap(coordinates, mapInstance);
            } else {
                toast.error("Aucun itinéraire trouvé");
            }
        } catch (error) {
            console.error("Erreur lors du calcul de l'itinéraire:", error);
            toast.error("Une erreur s'est produite lors du calcul de l'itinéraire.");
        } finally {
            setIsLoading(false);
        }
    };

    const displayRouteOnMap = (routeCoordinates: Array<[number, number]>, mapInstance: tt.Map) => {
        // Supprimer l'itinéraire existant s'il y en a un
        if (mapInstance.getSource('route')) {
            mapInstance.removeLayer('route-outline');
            mapInstance.removeLayer('route');
            mapInstance.removeSource('route');
        }

        // Ajouter le nouvel itinéraire
        mapInstance.addSource('route', {
            type: 'geojson',
            data: {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: routeCoordinates
                }
            }
        });

        // Contour de l'itinéraire (pour un effet de halo)
        mapInstance.addLayer({
            id: 'route-outline',
            type: 'line',
            source: 'route',
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': '#fff',
                'line-width': 9
            }
        });

        // Ligne principale de l'itinéraire
        mapInstance.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': '#5DB3FF',
                'line-width': 6
            }
        });

        // Ajuster la vue de la carte pour voir l'itinéraire complet
        const bounds = new tt.LngLatBounds();
        routeCoordinates.forEach(coord => {
            bounds.extend(coord as [number, number]);
        });

        mapInstance.fitBounds(bounds, {
            padding: { top: 50, bottom: 50, left: 50, right: 50 }
        });

        // Ajouter des marqueurs pour le départ et l'arrivée
        const startPoint = routeCoordinates[0];
        const endPoint = routeCoordinates[routeCoordinates.length - 1];

        // Créer l'élément pour le marqueur de départ
        const startElement = document.createElement('div');
        startElement.className = 'route-marker start-marker';
        startElement.innerHTML = '<div class="marker-inner"></div>';

        // Créer l'élément pour le marqueur d'arrivée
        const endElement = document.createElement('div');
        endElement.className = 'route-marker end-marker';
        endElement.innerHTML = '<div class="marker-inner"></div>';

        // Ajouter les marqueurs à la carte
        new tt.Marker({ element: startElement })
            .setLngLat(startPoint)
            .addTo(mapInstance);

        new tt.Marker({ element: endElement })
            .setLngLat(endPoint)
            .addTo(mapInstance);
    };

    return (
        <div>
            <ContainerMap map={map} />
            {map && <Markers map={map} />}
            <div ref={mapElement} style={{ width: "100%", height: "890px" }} />
            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                </div>
            )}
        </div>
    );
};

export default Map;