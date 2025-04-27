import "./css/map.css";
import { useState, useRef, useEffect } from "react";
import { LuSearch } from "react-icons/lu";
import { TbRouteSquare } from "react-icons/tb";
import { MdOutlineGpsFixed } from "react-icons/md";
import { BiExpand, BiCollapse } from "react-icons/bi"; // Added for minimize/expand icons
import tt, { Popup, Marker } from "@tomtom-international/web-sdk-maps";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TrafficIndicator from "./components/traffic-indicator.tsx";
import Search from "./serach/search-bar.tsx";
import RoutePlanner from "./serach/route-planner.tsx";
import {createMarkerDOMElement} from "./serach/marker-icon.tsx";
import {useTranslation} from "react-i18next";
import { getAddressFromCoordinates } from "../../../services/service/map-servie.tsx";

interface ContainerMapProps {
    map: tt.Map | null;
}

type Coordinate = [number, number];
type TrafficInfo = {
    incidents: number;
    congestion: 'light' | 'moderate' | 'heavy' | 'none';
    needsRerouting: boolean;
};

export default function ContainerMap({ map }: ContainerMapProps) {
    const [search, setSearch] = useState<boolean>(false);
    const [isRouteActive, setIsRouteActive] = useState<boolean>(false);
    const [startAddress, setStartAddress] = useState<string>("");
    const [show, setShow] = useState<boolean>(true);
    const [minimized, setMinimized] = useState<boolean>(false);
    const { t } = useTranslation();

    const popups = useRef<Popup[]>([]);
    const markers = useRef<Marker[]>([]);
    const startPointRefresh = useRef<Coordinate | null>(null);
    const endPointRefresh = useRef<Coordinate | null>(null);
    const routeIntervalRef = useRef<number | null>(null);
    const lastTrafficInfoRef = useRef<TrafficInfo | null>(null);

    useEffect(() => {
        return () => {
            if (routeIntervalRef.current) {
                clearInterval(routeIntervalRef.current);
            }
        };
    }, []);

    async function checkTrafficAndRecalculate(): Promise<void> {
        if (!isRouteActive || !startPointRefresh.current || !endPointRefresh.current || !map) {
            return;
        }

        try {
            const trafficInfo = await checkTrafficConditions(startPointRefresh.current, endPointRefresh.current);

            // Si les conditions ont changé et nécessitent un recalcul
            if (trafficInfo.needsRerouting &&
                (!lastTrafficInfoRef.current ||
                    trafficInfo.congestion !== lastTrafficInfoRef.current.congestion ||
                    trafficInfo.incidents !== lastTrafficInfoRef.current.incidents)) {

                // Afficher une notification toast
                const message = `${trafficInfo.incidents > 0 ? `${trafficInfo.incidents} incident(s) détecté(s). ` : ''}` +
                    `${trafficInfo.congestion !== 'none' ? `Circulation ${getCongestionLabel(trafficInfo.congestion)}. ` : ''}` +
                    'Recalcul de l\'itinéraire en cours...';

                toast.info(message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });

                // Recalculer l'itinéraire
                await updateRoute(startPointRefresh.current, endPointRefresh.current);
            }

            // Mettre à jour les dernières infos de trafic
            lastTrafficInfoRef.current = trafficInfo;

        } catch (error) {
            console.error("Erreur lors de la vérification du trafic :", error);
        }
    }

    function getCongestionLabel(congestion: string): string {
        switch (congestion) {
            case 'light': return 'légèrement perturbée';
            case 'moderate': return 'modérément perturbée';
            case 'heavy': return 'fortement perturbée';
            default: return 'normale';
        }
    }

    async function checkTrafficConditions(startPoint: Coordinate, endPoint: Coordinate): Promise<TrafficInfo> {
        const apiKey = import.meta.env.VITE_TOMTOM_API_KEY;
        const trafficUrl = `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=${apiKey}&point=${startPoint[1]},${startPoint[0]}&unit=KMPH`;
        const incidentsUrl = `https://api.tomtom.com/traffic/services/5/incidentDetails?key=${apiKey}&bbox=${Math.min(startPoint[0], endPoint[0])},${Math.min(startPoint[1], endPoint[1])},${Math.max(startPoint[0], endPoint[0])},${Math.max(startPoint[1], endPoint[1])}&fields={incidents{type,geometry,properties}}`;

        try {
            // Obtenir les informations de congestion
            const flowResponse = await fetch(trafficUrl);
            const flowData = await flowResponse.json();

            // Obtenir les informations d'incidents
            const incidentsResponse = await fetch(incidentsUrl);
            const incidentsData = await incidentsResponse.json();

            // Analyser le niveau de congestion
            let congestion: 'light' | 'moderate' | 'heavy' | 'none' = 'none';
            if (flowData.flowSegmentData) {
                const currentSpeed = flowData.flowSegmentData.currentSpeed;
                const freeFlowSpeed = flowData.flowSegmentData.freeFlowSpeed;

                if (freeFlowSpeed > 0) {
                    const ratio = currentSpeed / freeFlowSpeed;
                    if (ratio < 0.5) congestion = 'heavy';
                    else if (ratio < 0.7) congestion = 'moderate';
                    else if (ratio < 0.9) congestion = 'light';
                }
            }

            // Compter les incidents
            const incidentsCount = incidentsData.incidents?.length || 0;

            // Déterminer si un recalcul est nécessaire
            const needsRerouting = congestion !== 'none' || incidentsCount > 0;

            return {
                incidents: incidentsCount,
                congestion,
                needsRerouting
            };

        } catch (error) {
            console.error("Erreur lors de la vérification des conditions de circulation :", error);
            return { incidents: 0, congestion: 'none', needsRerouting: false };
        }
    }

    async function showRoute(routeData: string): Promise<void> {
        if (!map) return;

        try {
            const routeCoordinates: Coordinate[] = JSON.parse(routeData);

            if (map.getSource("route")) {
                map.removeLayer("route-layer");
                map.removeSource("route");
            }

            clearPopupsAndMarkers();

            map.addSource("route", {
                type: "geojson",
                data: {
                    type: "Feature",
                    geometry: {
                        type: "LineString",
                        coordinates: routeCoordinates,
                    },
                    properties: {},
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

            map.fitBounds(routeCoordinates.reduce(
                (bbox, [lon, lat]) => [
                    Math.min(bbox[0], lon),
                    Math.min(bbox[1], lat),
                    Math.max(bbox[2], lon),
                    Math.max(bbox[3], lat),
                ],
                [Infinity, Infinity, -Infinity, -Infinity]
            ) as [number, number, number, number], { padding: 50 });

            const startPoint = routeCoordinates[0];
            const endPoint = routeCoordinates[routeCoordinates.length - 1];

            startPointRefresh.current = startPoint;
            endPointRefresh.current = endPoint;

            const startMarker = new tt.Marker({
                element: createMarkerDOMElement("Départ")
            })
                .setLngLat(startPoint)
                .addTo(map);
            markers.current.push(startMarker);

            const endMarker = new tt.Marker({
                element: createMarkerDOMElement("Arrivée")
            })
                .setLngLat(endPoint)
                .addTo(map);
            markers.current.push(endMarker);

            // Activer le suivi de route et le recalcul automatique
            setIsRouteActive(true);

            // Démarrer le minuteur pour le recalcul de l'itinéraire (toutes les 60 secondes = 60000 ms)
            if (routeIntervalRef.current) {
                clearInterval(routeIntervalRef.current);
            }

            routeIntervalRef.current = window.setInterval(() => {
                checkTrafficAndRecalculate();
            }, 60000); // 60000 ms = 1 minute

            // Toast pour indiquer que l'itinéraire est actif avec suivi du trafic
            toast.success("Itinéraire calculé. Surveillance du trafic activée.", {
                position: "top-right",
                autoClose: 3000,
            });

        } catch (error) {
            console.error("Erreur lors de l'affichage de l'itinéraire :", error);
        }
    }

    function clearPopupsAndMarkers(): void {
        popups.current.forEach(popup => popup.remove());
        popups.current = [];

        markers.current.forEach(marker => marker.remove());
        markers.current = [];
    }

    async function updateRoute(startPoint: Coordinate, endPoint: Coordinate): Promise<void> {
        const apiKey = import.meta.env.VITE_TOMTOM_API_KEY;
        const url = `https://api.tomtom.com/routing/1/calculateRoute/${startPoint[1]},${startPoint[0]}:${endPoint[1]},${endPoint[0]}/json?key=${apiKey}&traffic=true`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.routes?.[0]) {
                const newRouteCoordinates = data.routes[0].legs.flatMap((leg: any) =>
                    leg.points.map((point: any) => [point.longitude, point.latitude] as Coordinate)
                );
                await showRoute(JSON.stringify(newRouteCoordinates));
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'itinéraire :", error);
        }
    }


    const onRouteCalculated = (routePolyline: string): void => {
        showRoute(routePolyline);
    };

    const onSearchResultSelect = (position: { lat: number; lon: number }): void => {
        if (map) {
            map.flyTo({
                center: [position.lon, position.lat],
                zoom: 14
            } as any);


            const searchMarker = new tt.Marker({
                element: createMarkerDOMElement("Recherche")
            }).setLngLat([position.lon, position.lat]).addTo(map);

            markers.current.push(searchMarker);
        }
    };

    async function getUserPosition(): Promise<void> {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    if (map) {
                        const userMarker = new tt.Marker({
                            element: createMarkerDOMElement("Position")
                        }).setLngLat([longitude, latitude]).addTo(map);

                        markers.current.push(userMarker);
                        map.flyTo({
                            center: [longitude, latitude],
                            zoom: 14
                        } as any);


                        const address = await getAddressFromCoordinates(latitude, longitude,t);

                        setStartAddress(address);

                        setSearch(true);

                        toast.info("Position récupérée: " + address, {
                            position: "top-right",
                            autoClose: 3000,
                        });
                    }
                },
                (error) => {
                    console.error("Erreur de géolocalisation:", error);
                    toast.error("Impossible de récupérer la position de l'utilisateur.", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            toast.error("La géolocalisation n'est pas supportée par ce navigateur.", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    }

    function stopRouteTracking(): void {
        if (map && map.getSource("route")) {
            map.removeLayer("route-layer");
            map.removeSource("route");
        }

        clearPopupsAndMarkers();

        if (routeIntervalRef.current) {
            clearInterval(routeIntervalRef.current);
            routeIntervalRef.current = null;
        }
        setIsRouteActive(false);

        toast.info("Surveillance du trafic désactivée.", {
            position: "top-right",
            autoClose: 3000,
        });
    }

    function toggleMinimize(): void {
        setMinimized(!minimized);
    }

    return (
        <div>
            {show ? (
                <div>
                    <ToastContainer />
                    <div className="bg-white shadow-sm sm:rounded-lg container-modal">
                        <div className="flex justify-between items-center px-2 pt-2">
                            <button
                                onClick={toggleMinimize}
                                className="text-gray-500 hover:text-gray-700"
                                title={minimized ? "Agrandir" : "Réduire"}
                            >
                                {minimized ? <BiExpand size={20} /> : <BiCollapse size={20} />}
                            </button>
                            <button
                                onClick={() => setShow(false)}
                                className="text-gray-500 hover:text-gray-700"
                                title="Fermer"
                            >
                                ✕
                            </button>
                        </div>

                        {!minimized && (
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
                                    <div className="flex" style={{ alignItems: "center", justifyContent: "space-between" }}>
                                        <div className="cursor-pointer position-user hover:py-1">
                                            <MdOutlineGpsFixed
                                                className="hover:p-[1px]"
                                                style={{ fontSize: "20px" }}
                                                onClick={getUserPosition}
                                            />
                                        </div>
                                        <div className="flex justify-end items-center">
                                            <LuSearch
                                                onClick={() => setSearch(false)}
                                                style={{ fontSize: "20px" }}
                                                className={`text-md m-2 cursor-pointer hover:p-[1px] ${search ? 'text-gray-500' : 'text-blue-500'}`}
                                            />
                                            <TbRouteSquare
                                                onClick={() => setSearch(true)}
                                                style={{ fontSize: "20px" }}
                                                className={`text-md m-2 cursor-pointer hover:p-[1px] ${search ? 'text-blue-500' : 'text-gray-500'}`}
                                            />
                                        </div>
                                    </div>

                                    {!search && <Search onSearchResultSelect={onSearchResultSelect} initialValue={""} />}
                                    {search && (
                                        <>
                                            <RoutePlanner
                                                onRouteCalculated={onRouteCalculated}
                                                startAddress={startAddress}
                                            />
                                            {isRouteActive && (
                                                <div className="mt-2 text-center">
                                                    <button
                                                        onClick={stopRouteTracking}
                                                        className="px-3 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600"
                                                    >
                                                        Arrêter le suivi du trafic
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                                <TrafficIndicator />
                            </div>
                        )}
                        {minimized && (
                            <div className="px-4 py-2 flex items-center justify-center">
                                <span className="text-sm font-medium">Carte - Cliquez pour agrandir</span>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="fixed bottom-4 right-4 bg-white shadow-md rounded-lg p-2 cursor-pointer" onClick={() => setShow(true)}>
                    <span className="text-sm font-medium">Ouvrir la carte</span>
                </div>
            )}
        </div>
    );
}