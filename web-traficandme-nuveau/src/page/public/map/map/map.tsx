import React, { useEffect, useRef, useState, useCallback } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import ContainerMap from "../container-map.tsx";
import Markers from "../markers/markers.tsx";
import "../css/map.css";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Coordinate, RouteResponse } from "../model/map.tsx";
import {translateMessage} from "../../../../assets/i18/translateMessage.tsx";

const TRAFFIC_REFRESH_INTERVAL = 90000000;
const MARKERS_REFRESH_INTERVAL = 300000;
const DEFAULT_CENTER: [number, number] = [2.3522, 48.8566];
const DEFAULT_ZOOM = 12;
const DETAILED_ZOOM = 18;

const Map: React.FC = () => {
    const mapElement = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<tt.Map | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const markersRef = useRef<tt.Marker[]>([]);
    const intervalRefs = useRef<number[]>([]);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const apiKey = import.meta.env.VITE_TOMTOM_API_KEY;

    const urlLat = searchParams.get('lat');
    const urlLng = searchParams.get('lng');
    const startLat = searchParams.get('startLat');
    const startLon = searchParams.get('startLon');
    const endLat = searchParams.get('endLat');
    const endLon = searchParams.get('endLon');
    const mode = searchParams.get('mode');
    const peage = searchParams.get('peage') === 'true';

    const enableTrafficLayer = useCallback((mapInstance: tt.Map) => {
        if (!mapInstance) return;

        if (mapInstance.getSource("traffic-source")) {
            mapInstance.removeLayer("traffic-layer");
            mapInstance.removeSource("traffic-source");
        }

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
    }, [apiKey]);

    const calculateRouteFromParams = useCallback(async (
        startCoord: Coordinate,
        endCoord: Coordinate,
        routeType: "fastest" | "shortest",
        avoidTolls: boolean,
        mapInstance: tt.Map
    ) => {
        if (!mapInstance) return;

        setIsLoading(true);
        try {
            const avoid = avoidTolls ? "&avoid=tollRoads" : "";
            const url = `https://api.tomtom.com/routing/1/calculateRoute/${startCoord.lat},${startCoord.lon}:${endCoord.lat},${endCoord.lon}/json?key=${apiKey}&routeType=${routeType}${avoid}`;

            const response = await fetch(url);
            const data: RouteResponse = await response.json();

            if (data.routes?.length > 0 && data.routes[0].legs?.length > 0) {
                const route = data.routes[0];
                const points = route.legs[0].points;
                const coordinates = points.map((p) => [p.longitude, p.latitude] as [number, number]);
                displayRouteOnMap(coordinates, mapInstance);
            } else {
                toast.error(await translateMessage("No routes found"));
            }
        } catch (error) {
            console.error("Erreur lors du calcul de l'itinéraire:", error);
            toast.error("Une erreur s'est produite lors du calcul de l'itinéraire.");
        } finally {
            setIsLoading(false);
        }
    }, [apiKey]);

    // Display route on map as a memoized function
    const displayRouteOnMap = useCallback((routeCoordinates: Array<[number, number]>, mapInstance: tt.Map) => {
        if (!mapInstance || !routeCoordinates.length) return;

        // Remove existing route if it exists
        if (mapInstance.getSource('route')) {
            mapInstance.removeLayer('route-outline');
            mapInstance.removeLayer('route');
            mapInstance.removeSource('route');
        }

        // Add new route source
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

        // Add route outline (white border)
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

        // Add route line
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

        // Fit map to route bounds
        const bounds = new tt.LngLatBounds();
        routeCoordinates.forEach(coord => {
            bounds.extend(coord);
        });

        mapInstance.fitBounds(bounds, {
            padding: 50
        });




        // Add start and end markers
        const startPoint = routeCoordinates[0];
        const endPoint = routeCoordinates[routeCoordinates.length - 1];

        // Create marker elements
        const startElement = document.createElement('div');
        startElement.className = 'route-marker start-marker';
        startElement.innerHTML = '<div class="marker-inner"></div>';

        const endElement = document.createElement('div');
        endElement.className = 'route-marker end-marker';
        endElement.innerHTML = '<div class="marker-inner"></div>';

        // Add markers to map
        new tt.Marker({ element: startElement })
            .setLngLat(startPoint)
            .addTo(mapInstance);

        new tt.Marker({ element: endElement })
            .setLngLat(endPoint)
            .addTo(mapInstance);
    }, []);

    // Setup map and intervals
    useEffect(() => {
        if (!mapElement.current) return;

        // Clear existing map and intervals before creating new ones
        if (map) map.remove();

        intervalRefs.current.forEach(interval => clearInterval(interval));
        intervalRefs.current = [];

        // Determine map center and zoom
        let center: [number, number];
        let zoom: number;

        if (startLat && startLon && endLat && endLon) {
            center = [parseFloat(startLon), parseFloat(startLat)];
            zoom = DEFAULT_ZOOM;
        } else if (urlLat && urlLng) {
            center = [parseFloat(urlLng), parseFloat(urlLat)];
            zoom = DETAILED_ZOOM;
        } else {
            center = DEFAULT_CENTER;
            zoom = DEFAULT_ZOOM;
        }

        // Create map instance
        const mapInstance = tt.map({
            key: apiKey,
            container: mapElement.current,
            center,
            zoom,
        });

        setMap(mapInstance);

        // Set up map when loaded
        mapInstance.on("load", () => {
            // Enable traffic layer
            enableTrafficLayer(mapInstance);

            // Calculate route if params are present
            if (startLat && startLon && endLat && endLon) {
                calculateRouteFromParams(
                    { lat: parseFloat(startLat), lon: parseFloat(startLon) },
                    { lat: parseFloat(endLat), lon: parseFloat(endLon) },
                    mode === 'Rapide' ? 'fastest' : 'shortest',
                    !peage,
                    mapInstance
                );
            }

            // Set up markers refresh interval
            const incidentInterval = setInterval(() => {
                markersRef.current.forEach(marker => marker.remove());
                markersRef.current = [];
            }, MARKERS_REFRESH_INTERVAL);
            intervalRefs.current.push(incidentInterval);

            // Set up traffic layer refresh interval
            const trafficInterval = setInterval(() => {
                enableTrafficLayer(mapInstance);
            }, TRAFFIC_REFRESH_INTERVAL);
            intervalRefs.current.push(trafficInterval);
        });

        // Cleanup function
        return () => {
            if (mapInstance) mapInstance.remove();
            intervalRefs.current.forEach(interval => clearInterval(interval));
            intervalRefs.current = [];
        };
    }, [
        apiKey,
        location.search,
        enableTrafficLayer,
        calculateRouteFromParams,
        startLat,
        startLon,
        endLat,
        endLon,
        urlLat,
        urlLng,
        mode,
        peage
    ]);

    return (
        <div>
            <ContainerMap map={map} />
            {map && <Markers map={map} markerRefs={markersRef} />}
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