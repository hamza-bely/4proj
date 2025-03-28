import React, { useEffect, useRef, useState } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import ContainerMap from "../container-map.tsx";
import Markers from "../markers/markers.tsx";
import "../map.css"

const Map: React.FC = () => {
    const mapElement = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<tt.Map | null>(null);
    const apiKey = import.meta.env.VITE_TOMTOM_API_KEY;

    useEffect(() => {
        if (mapElement.current) {
            const mapInstance = tt.map({
                key: apiKey,
                container: mapElement.current,
                center: [2.3522, 48.8566],
                zoom: 12,
            });


            setMap(mapInstance);

            return () => {
                mapInstance.remove();
            };
        }
    }, [apiKey]);

    return (
        <div>
            <ContainerMap map={map} />
            {map && <Markers map={map} />}

            <div ref={mapElement} style={{ width: "100%", height: "850px" }} />
        </div>
    );
};

export default Map;
