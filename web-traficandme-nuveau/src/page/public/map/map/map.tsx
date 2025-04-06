import React, { useEffect, useRef, useState } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import ContainerMap from "../container-map.tsx";
import Markers from "../markers/markers.tsx";
import "../map.css";

const Map: React.FC = () => {
    const mapElement = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<tt.Map | null>(null);
    const apiKey = import.meta.env.VITE_TOMTOM_API_KEY;
    const time: number = 90000000;
    let markers: tt.Marker[] = [];

    useEffect(() => {
        if (!mapElement.current || map) return;

        const mapInstance = tt.map({
            key: apiKey,
            container: mapElement.current,
            center: [2.3522, 48.8566],
            zoom: 12,
        });

        setMap(mapInstance);

        mapInstance.on("load", () => {
            enableTrafficLayer(mapInstance);

            // Mise à jour automatique des incidents
            const incidentInterval = setInterval(() => {
                markers.forEach(marker => marker.remove());
                markers = [];
            }, 300000); // Rafraîchit les incidents toutes les 5 minutes

            // Mise à jour de la couche de trafic
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

        return () => mapInstance.remove();
    }, [apiKey]);

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
