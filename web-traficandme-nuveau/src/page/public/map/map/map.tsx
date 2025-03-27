import React, { useEffect, useRef, useState } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import ContainerMap from "../container-map.tsx";
import Markers from "../markers/markers.tsx";
import { MdOutlineGpsFixed } from "react-icons/md";
import "../map.css"

const Map: React.FC = () => {
    const mapElement = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<tt.Map | null>(null);
    const apiKey = import.meta.env.VITE_TOMTOM_API_KEY;
    const [userPosition, setUserPosition] = useState<[number, number] | null>(null);



    const getUserPosition = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserPosition([longitude, latitude]);
                },
                (error) => {
                    console.error("Erreur de géolocalisation:", error);
                    alert("Impossible de récupérer la position de l'utilisateur.");
                }
            );
        } else {
            alert("La géolocalisation n'est pas supportée par ce navigateur.");
        }
    };

    useEffect(() => {
        if (mapElement.current) {
            const mapInstance = tt.map({
                key: apiKey,
                container: mapElement.current,
                center: userPosition || [2.3522, 48.8566],
                zoom: 12,
            });

            if (userPosition) {
                 new tt.Marker()
                    .setLngLat(userPosition)
                    .addTo(mapInstance);
            }

            setMap(mapInstance);

            return () => {
                mapInstance.remove();
            };
        }
    }, [apiKey, userPosition]);

    return (
        <div>
            <div className="position-user">
                <MdOutlineGpsFixed  onClick={getUserPosition} />
            </div>
            <ContainerMap map={map} />
            {map && <Markers map={map} />}

            <div ref={mapElement} style={{ width: "100%", height: "850px" }} />
        </div>
    );
};

export default Map;
