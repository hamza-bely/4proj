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

    async function showRoute(routeData: string) {
        if (!map) return;

        try {
            const routeCoordinates = JSON.parse(routeData); // Convertir la chaîne JSON en tableau

            // Supprimer l'ancienne route si elle existe
            if (map.getSource("route")) {
                map.removeLayer("route-layer");
                map.removeSource("route");
            }

            // Ajouter une nouvelle source pour l'itinéraire
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

            // Ajouter un calque pour afficher l'itinéraire
            map.addLayer({
                id: "route-layer",
                type: "line",
                source: "route",
                layout: {
                    "line-join": "round",
                    "line-cap": "round",
                },
                paint: {
                    "line-color": "#5DB3FF", // Couleur de la ligne
                    "line-width": 8, // Largeur de la ligne
                },
            });

            // Ajuster la carte pour afficher l'itinéraire
            map.fitBounds(routeCoordinates.reduce((bbox, coord) => {
                const [lon, lat] = coord;
                return [
                    Math.min(bbox[0], lon),
                    Math.min(bbox[1], lat),
                    Math.max(bbox[2], lon),
                    Math.max(bbox[3], lat),
                ];
            }, [Infinity, Infinity, -Infinity, -Infinity]), { padding: 50 });

            // Ajouter les icônes de départ et d'arrivée
            const startPoint = routeCoordinates[0]; // Point de départ
            const endPoint = routeCoordinates[routeCoordinates.length - 1]; // Point d'arrivée

            // Ajouter un marqueur pour le point de départ
            new tt.Marker({ element: createCustomIcon("Départ") })
                .setLngLat(startPoint)
                .addTo(map);

            // Ajouter un marqueur pour le point d'arrivée
            new tt.Marker({ element: createCustomIcon("Arrivée") })
                .setLngLat(endPoint)
                .addTo(map);

        } catch (error) {
            console.error("Erreur lors de l'affichage de l'itinéraire :", error);
        }
    }

// Fonction pour créer un marqueur personnalisé (avec texte, ou icône)
    function createCustomIcon(type: string) {
        const div = document.createElement("div");
        div.style.backgroundColor = type === "Départ" ? "green" : "red"; // Couleur pour le départ (vert) et l'arrivée (rouge)
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
    }

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

        if (!map.getLayer("traffic")) {
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

