import React, { useEffect, useRef, useState } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import ContainerMap from "../container-map.tsx";
import Markers from "../markers/markers.tsx";
import "../css/map.css";
import { useLocation } from "react-router-dom";

const Map: React.FC = () => {
    const mapElement = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<tt.Map | null>(null);
    const apiKey = import.meta.env.VITE_TOMTOM_API_KEY;
    const time: number = 90000000;
    const location = useLocation();
    let markers: tt.Marker[] = [];

    const searchParams = new URLSearchParams(location.search);
    const urlLat = searchParams.get('lat');
    const urlLng = searchParams.get('lng');

    const defaultCenter: [number, number] = [2.3522, 48.8566];

    useEffect(() => {
        if (!mapElement.current) return;
        if (map) map.remove();

        const center: [number, number] = urlLat && urlLng
            ? [parseFloat(urlLng), parseFloat(urlLat)]
            : defaultCenter;

        const zoom = urlLat && urlLng ? 18 : 12;

        const mapInstance = tt.map({
            key: apiKey,
            container: mapElement.current,
            center: center,
            zoom: zoom,
        });

        setMap(mapInstance);

        mapInstance.on("load", () => {
            enableTrafficLayer(mapInstance);

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
    }, [apiKey, location.search]); // Ajout de location.search dans les dépendances

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

    return (
        <div>
            <ContainerMap map={map} />
            {map && <Markers map={map} />}
            <div ref={mapElement} style={{ width: "100%", height: "890px" }} />
        </div>
    );
};

export default Map;