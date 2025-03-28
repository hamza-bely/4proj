import "./map.css"
import Search from "./serach/search-bar.tsx";
import RoutePlanner from "./serach/route-planner.tsx";
import  {useState} from "react";
import { LuSearch } from "react-icons/lu";
import {TbRouteSquare} from "react-icons/tb";
import {MdOutlineGpsFixed} from "react-icons/md";
import tt from "@tomtom-international/web-sdk-maps";


interface ContainerMapProps {
    map: tt.Map | null;
}

export default function  ContainerMap   ({ map }: ContainerMapProps )  {

    const [search , setSearch]= useState<boolean>(false)

    const showRoute = (routeData: string) => {
        if (!map) return;

        try {
            const routeCoordinates = JSON.parse(routeData); // Convertir la chaîne JSON en tablea

            // Vérifier si une route existe déjà et la supprimer avant d'ajouter la nouvelle
            if (map.getSource("route")) {
                map.removeLayer("route-layer");
                map.removeSource("route");
            }

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

            // Ajouter le layer pour dessiner la route
            map.addLayer({
                id: "route-layer",
                type: "line",
                source: "route",
                layout: {
                    "line-join": "round",
                    "line-cap": "round",
                },
                paint: {
                    "line-color": "#19589b", // Rouge
                    "line-width": 8,
                },
            });

            const bounds = routeCoordinates.reduce((bbox, coord) => {
                const [lon, lat] = coord;
                return [
                    Math.min(bbox[0], lon),
                    Math.min(bbox[1], lat),
                    Math.max(bbox[2], lon),
                    Math.max(bbox[3], lat),
                ];
            }, [Infinity, Infinity, -Infinity, -Infinity]);

            map.fitBounds(bounds, { padding: 50 });
        } catch (error) {
            console.error("Erreur lors de l'affichage de l'itinéraire :", error);
        }
    };

    // Callback de l'itinéraire calculé (à partir de RoutePlanner)
    const onRouteCalculated = (routePolyline: string) => {
        showRoute(routePolyline);
    };

    // Lorsque l'utilisateur sélectionne un résultat de recherche
    const onSearchResultSelect = (position: { lat: number; lon: number }) => {
        if (map) {
            map.flyTo({ center: [position.lon, position.lat], zoom: 15 });
            new tt.Marker().setLngLat([position.lon, position.lat]).addTo(map);
        }
    };

    function getUserPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;

                    if (map) {
                        // Ajouter un marqueur à la position actuelle
                        new tt.Marker()
                            .setLngLat([longitude, latitude])
                            .addTo(map);

                        // Centrer la carte sur la position de l'utilisateur
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

    function enableTrafficLayer() {
        if (!map) return;

        // Vérifie si la couche de trafic existe déjà
        if (!map.getLayer("traffic")) {
            // Ajoute une source de trafic en temps réel
            map.addLayer({
                id: "traffic",
                type: "raster",
                source: {
                    type: "raster",
                    tiles: [
                        "https://api.tomtom.com/traffic/map/4/tile/flow/relative0/{z}/{x}/{y}.png?key=9zc7scbLhpcrEFouo0xJWt0jep9qNlnv"
                    ],
                    tileSize: 256
                },
                layout: {
                    visibility: "visible"
                }
            });
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

                                <button
                                    onClick={enableTrafficLayer}
                                    className="bg-blue-500 text-white p-2 rounded shadow"
                                >
                                    Afficher le trafic
                                </button>

                            </div>
                        </div>

                        {!search && <Search onSearchResultSelect={onSearchResultSelect}/>}
                        {search && <RoutePlanner onRouteCalculated={onRouteCalculated}/>}
                    </div>

                </div>
            </div>
        </div>
    );
};

