import "./map.css"
import Search from "./serach/search-bar.tsx";
import RoutePlanner from "./serach/route-planner.tsx";
import { useState} from "react";
import { LuSearch } from "react-icons/lu";
import {TbRouteSquare} from "react-icons/tb";
import {MdOutlineGpsFixed} from "react-icons/md";
import tt from "@tomtom-international/web-sdk-maps";
import TrafficIndicator from "./traffic-indicator.tsx";

interface ContainerMapProps {
    map: tt.Map | null;
}

export default function  ContainerMap   ({ map }: ContainerMapProps )  {
    const [search , setSearch]= useState<boolean>(false)

    // Variables globales pour stocker les popups et marqueurs
    let popups = [];
    let markers = [];

    async function showRoute(routeData: string) {
        if (!map) return;

        try {
            const routeCoordinates = JSON.parse(routeData);

            // Supprimer l'ancienne route
            if (map.getSource("route")) {
                map.removeLayer("route-layer");
                map.removeSource("route");
            }

            // Supprimer les anciens popups et marqueurs
            clearPopupsAndMarkers();

            // Ajouter la nouvelle route
            map.addSource("route", {
                type: "geojson",
                data: {
                    type: "Feature",
                    geometry: {
                        type: "LineString",
                        coordinates: routeCoordinates,
                    },
                },
            });

            map.addLayer({
                id: "route-layer",
                type: "line",
                source: "route",
                layout: {
                    "line-join": "round",
                    "line-cap": "round",
                },
                paint: {
                    "line-color": "#5DB3FF",
                    "line-width": 8,
                },
            });

            map.fitBounds(routeCoordinates.reduce((bbox, coord) => {
                const [lon, lat] = coord;
                return [
                    Math.min(bbox[0], lon),
                    Math.min(bbox[1], lat),
                    Math.max(bbox[2], lon),
                    Math.max(bbox[3], lat),
                ];
            }, [Infinity, Infinity, -Infinity, -Infinity]), { padding: 50 });

            const startPoint = routeCoordinates[0];
            const endPoint = routeCoordinates[routeCoordinates.length - 1];

            // Ajouter un marqueur pour le point de départ
            const startMarker = new tt.Marker({ element: createCustomIcon("Départ") })
                .setLngLat(startPoint)
                .addTo(map);
            markers.push(startMarker); // Stocker le marqueur

            // Ajouter un marqueur pour le point d'arrivée
            const endMarker = new tt.Marker({ element: createCustomIcon("Arrivée") })
                .setLngLat(endPoint)
                .addTo(map);
            markers.push(endMarker); // Stocker le marqueur

            // Obtenir la durée du trajet avec TomTom
            const duration = await getRouteDuration(startPoint, endPoint);

            // Obtenir le point médian de la route
            const middlePoint = routeCoordinates[Math.floor(routeCoordinates.length / 2)];

            // Ajouter un popup avec la durée du trajet (ouvert par défaut)
            const popup = new tt.Popup({ offset: 10, closeButton: false, closeOnClick: false })
                .setLngLat(middlePoint)
                .setHTML(`<strong>Durée du trajet :</strong> ${duration}`)
                .addTo(map);

            popups.push(popup); // Stocker le popup

        } catch (error) {
            console.error("Erreur lors de l'affichage de l'itinéraire :", error);
        }
    }

    function clearPopupsAndMarkers() {
        popups.forEach(popup => popup.remove());
        popups = [];

        markers.forEach(marker => marker.remove());
        markers = [];
    }

    async function getRouteDuration(startPoint, endPoint) {
        const apiKey = '9zc7scbLhpcrEFouo0xJWt0jep9qNlnv';
        const url = `https://api.tomtom.com/routing/1/calculateRoute/${startPoint[1]},${startPoint[0]}:${endPoint[1]},${endPoint[0]}/json?key=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.routes && data.routes[0] && data.routes[0].summary) {
                const durationInSeconds = data.routes[0].summary.travelTimeInSeconds;
                const hours = Math.floor(durationInSeconds / 3600);
                const minutes = Math.floor((durationInSeconds % 3600) / 60);
                return `${hours}h ${minutes}min`;
            }
            return 'Inconnue';
        } catch (error) {
            console.error("Erreur lors du calcul de la durée du trajet :", error);
            return 'Erreur';
        }
    }

    function createCustomIcon(type) {
        const div = document.createElement("div");
        div.style.backgroundColor = type === "Départ" ? "green" : "red"; // Vert pour départ, rouge pour arrivée
        div.style.width = "20px";
        div.style.height = "20px";
        div.style.borderRadius = "50%";
        div.style.display = "flex";
        div.style.alignItems = "center";
        div.style.justifyContent = "center";
        div.style.color = "white";
        div.style.fontSize = "12px";
        div.style.fontWeight = "bold";
        div.innerText = type === "Départ" ? "D" : "A";
        return div;
    }

    const onRouteCalculated = (routePolyline: string) => {
        showRoute(routePolyline);
    };

    const onSearchResultSelect = (position: { lat: number; lon: number }) => {
        if (map) {
            map.flyTo({ center: [position.lon, position.lat], zoom: 15 });
            new tt.Marker().setLngLat([position.lon, position.lat]).addTo(map);
        }
    }

    function getUserPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;

                    if (map) {
                        new tt.Marker()
                            .setLngLat([longitude, latitude])
                            .addTo(map);

                        map.flyTo({ center: [longitude, latitude], zoom: 14 });
                    }
                },
                (error) => {
                    console.error("Erreur de géolocalisation:", error);
                    alert("Impossible de récupérer la position de l'utilisateur.");
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // Amélioration de la précision
            );
        } else {
            alert("La géolocalisation n'est pas supportée par ce navigateur.");
        }
    }

    return (
        <div>
            <div className="bg-white shadow-sm sm:rounded-lg  container-modal">
                <div className="px-4 py-5 sm:p-6">
                    <div className="flex justify-center">
                        <img
                            className="h-12 w-auto"
                            src="/images/logo/logo_2.png"
                            alt="Logo"
                            height="400"
                            width="400"
                        />
                    </div>
                    <div className="mt-5">
                        <div className="flex" style={{alignItems: "center", justifyContent: "space-between"}}>
                            <div  className=" cursor-pointer position-user hover:py-1">
                                <MdOutlineGpsFixed
                                    className=" hover:p-[1px]"
                                    style={{fontSize: "20px"}}
                                    onClick={getUserPosition}/>
                            </div>
                            <div style={{alignItems: "center"}} className="flex justify-end item-ceter">

                                <LuSearch
                                    onClick={() => setSearch(false)}
                                    style={{fontSize: "20px"}}
                                    className={`text-md m-2 cursor-pointer  hover:p-[1px]  ${search ? 'text-gray-500' : 'text-blue-500'}`}
                                />
                                <TbRouteSquare
                                    onClick={() => setSearch(true)}
                                    style={{fontSize: "20px"}}
                                    className={`text-md m-2 cursor-pointer  hover:p-[1px] ${search ? 'text-blue-500' : 'text-gray-500'}`}
                                />

                            </div>
                        </div>

                        {!search && <Search onSearchResultSelect={onSearchResultSelect}/>}
                        {search && <RoutePlanner onRouteCalculated={onRouteCalculated}/>}
                    </div>
                    <TrafficIndicator/>
                </div>
            </div>
        </div>
    );
};

