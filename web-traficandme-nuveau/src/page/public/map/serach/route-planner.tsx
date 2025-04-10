"use client";

import React, { useEffect, useState, useRef } from "react";
import "../css/map.css";
import { toast } from "react-toastify";
import Search from "./search-bar.tsx";
import { useTranslation } from "react-i18next";
import { LuRabbit, LuArrowLeft, LuSave, LuX, LuCrosshair } from "react-icons/lu";
import { TbBarrierBlockOff, TbRoute2 } from "react-icons/tb";
import { MdQrCode2, MdDirectionsCar, MdDirectionsBike, MdDirectionsWalk } from "react-icons/md";
import useRouteStore from "../../../../services/store/route-store.tsx";
import Cookies from "js-cookie";
import {getUserRole} from "../../../../services/service/token-service.tsx";
import {fetchUser} from "../../../../services/service/user-service.tsx";
import {RouteOption, RoutePlannerProps, RouteSaveData} from "../model/route-planner-model.tsx";
import {Coordinate, RouteResponse} from "../model/map.tsx";

import { QRCodeSVG } from 'qrcode.react';

// Type pour le moyen de transport
type TransportMode = "car" | "bike" | "walk";

const RoutePlanner: React.FC<RoutePlannerProps> = ({ onRouteCalculated }) => {
    const [start, setStart] = useState<Coordinate>({ lat: 47.6640, lon: 2.8357 });
    const [end, setEnd] = useState<Coordinate>({ lat: 45.7640, lon: 4.835 });
    const { t } = useTranslation();
    const { createRoute } = useRouteStore();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [routeOptions, setRouteOptions] = useState<RouteOption[]>([]);
    const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
    const [role, setRole] = useState<string | string[] | null>(null);
    const token = Cookies.get("authToken");
    const [startAddress, setStartAddress] = useState<string>("");
    const [endAddress, setEndAddress] = useState<string>("");
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [showResults, setShowResults] = useState<boolean>(false);
    const [showQRCode, setShowQRCode] = useState<boolean>(false);
    const [qrCodeData, setQrCodeData] = useState<string>("");
    const [isLocating, setIsLocating] = useState<boolean>(false);
    const [transportMode, setTransportMode] = useState<TransportMode>("car");
    const [currentPosition, setCurrentPosition] = useState<number>(0);
    const simulationIntervalRef = useRef<number | null>(null);
    const apiKey: string = import.meta.env.VITE_TOMTOM_API_KEY;

    useEffect(() => {
        setRole(getUserRole());
        if (token) fetchUser().catch(console.error);

        // Nettoyage de l'intervalle de simulation à la fermeture du composant
        return () => {
            if (simulationIntervalRef.current) {
                window.clearInterval(simulationIntervalRef.current);
            }
        };
    }, [token]);

    // Effet pour envoyer la position actuelle au composant parent lors de la simulation
    useEffect(() => {
        if ( selectedRouteId) {
            const selectedRoute = routeOptions.find(route => route.id === selectedRouteId);
            if (selectedRoute && selectedRoute.coordinates && selectedRoute.coordinates.length > 0) {
                const currentCoordIndex = Math.floor(currentPosition * (selectedRoute.coordinates.length - 1));
                const currentCoord = selectedRoute.coordinates[currentCoordIndex];
                // Mise à jour de la position du véhicule sur la carte (via le parent)
                const vehiclePosition = {
                    position: [currentCoord[0], currentCoord[1]],
                    type: transportMode,
                    progress: currentPosition
                };
                // On envoie cette information au composant parent via un événement personnalisé
                const event = new CustomEvent("vehiclePositionUpdate", { detail: vehiclePosition });
                window.dispatchEvent(event);
            }
        }
    }, [currentPosition, selectedRouteId, transportMode, routeOptions]);

    const formatDuration = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
    };

    const formatDistance = (meters: number): string => {
        const km = meters / 1000;
        return `${km.toFixed(1)} km`;
    };

    const calculateRoute = async (routeType: "fastest" | "shortest", avoidTolls: boolean): Promise<RouteOption | null> => {
        // Ajout du paramètre travelMode en fonction du mode de transport sélectionné
        let travelMode = "car";
        switch (transportMode) {
            case "bike":
                travelMode = "bicycle";
                break;
            case "walk":
                travelMode = "pedestrian";
                break;
            default:
                travelMode = "car";
        }

        const avoid = avoidTolls ? "&avoid=tollRoads" : "";
        const url = `https://api.tomtom.com/routing/1/calculateRoute/${start.lat},${start.lon}:${end.lat},${end.lon}/json?key=${apiKey}&routeType=${routeType}${avoid}&travelMode=${travelMode}`;

        try {
            const response = await fetch(url);
            const data: RouteResponse = await response.json();

            if (data.routes.length > 0 && data.routes[0].legs.length > 0) {
                const route = data.routes[0];
                const points = route.legs[0].points;
                const coordinates = points.map((p) => [p.longitude, p.latitude] as [number, number]);

                const id = `${routeType}-${avoidTolls ? 'no-tolls' : 'with-tolls'}-${travelMode}-${Date.now()}`;
                const name = `${routeType === 'fastest' ? t('map.fastest') : t('map.shortest')}${avoidTolls ? ` (${t('map.no-tolls')})` : ''}`;

                return {
                    id,
                    name,
                    coordinates,
                    distance: route.summary.lengthInMeters,
                    duration: route.summary.travelTimeInSeconds,
                    type: routeType,
                    avoidTolls,
                    travelMode
                };
            }
            return null;
        } catch (error) {
            console.error(`Erreur lors du calcul de l'itinéraire ${routeType}:`, error);
            return null;
        }
    };

    const handleCalculateRoutes = async (): Promise<void> => {
        if (!start || !end) {
            toast.error("Veuillez sélectionner un point de départ et une destination.");
            return;
        }

        onRouteCalculated("[]");

        setIsLoading(true);
        setRouteOptions([]);
        setSelectedRouteId(null); // on désélectionne aussi l'ancien itinéraire

        try {
            const routePromises = [
                calculateRoute("fastest", false),
                calculateRoute("shortest", false),
                calculateRoute("fastest", true),
                calculateRoute("shortest", true)
            ];

            const results = await Promise.all(routePromises);
            const validRoutes = results.filter(route => route !== null) as RouteOption[];

            if (validRoutes.length > 0) {
                setRouteOptions(validRoutes);
                setSelectedRouteId(validRoutes[0].id);
                onRouteCalculated(JSON.stringify(validRoutes[0].coordinates)); // afficher la première route
                setShowResults(true);
            }
        } catch (error) {
            console.error("Erreur lors du calcul des itinéraires :", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRouteSelect = (routeId: string) => {
        const selectedRoute = routeOptions.find(route => route.id === routeId);
        if (selectedRoute) {
            setSelectedRouteId(routeId);
            onRouteCalculated(JSON.stringify(selectedRoute.coordinates));

            // On arrête la simulation actuelle si elle est en cours
        }
    };

    const handleBackToSearch = () => {
        setShowResults(false);
    };

    const handleSaveRoute = async () => {
        if (!selectedRouteId) {
            toast.error("Veuillez sélectionner un itinéraire à sauvegarder");
            return;
        }

        setIsSaving(true);
        try {
            const selectedRoute = routeOptions.find(route => route.id === selectedRouteId);
            if (!selectedRoute) {
                toast.error("Itinéraire non trouvé");
                return;
            }

            const routeData: RouteSaveData = {
                startLongitude: start.lon.toString(),
                startLatitude: start.lat.toString(),
                endLongitude: end.lon.toString(),
                endLatitude: end.lat.toString(),
                address_start: startAddress,
                address_end: endAddress,
                user: "", // This will be filled in by the backend or auth context
                mode: selectedRoute.type === "fastest" ? "Rapide" : "Court",
                peage: !selectedRoute.avoidTolls
            };

            await createRoute(routeData);
        } catch (error) {
            console.error("Erreur lors de la sauvegarde de l'itinéraire :", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleGenerateQRCode = () => {
        if (!selectedRouteId) {
            toast.error("Veuillez sélectionner un itinéraire pour générer un QR code");
            return;
        }

        try {
            const selectedRoute = routeOptions.find(route => route.id === selectedRouteId);
            if (!selectedRoute) {
                toast.error("Itinéraire non trouvé");
                return;
            }

            // Création des données pour le QR code
            const qrData = {
                start: {
                    lat: start.lat,
                    lon: start.lon,
                    address: startAddress
                },
                end: {
                    lat: end.lat,
                    lon: end.lon,
                    address: endAddress
                },
                route: {
                    type: selectedRoute.type,
                    avoidTolls: selectedRoute.avoidTolls,
                    distance: selectedRoute.distance,
                    duration: selectedRoute.duration,
                    transportMode: transportMode
                }
            };

            // Convertir les données en chaîne JSON
            const qrCodeDataStr = JSON.stringify(qrData);
            setQrCodeData(qrCodeDataStr);

            // Afficher la modale
            setShowQRCode(true);
        } catch (error) {
            console.error("Erreur lors de la génération du QR code :", error);
            toast.error("Erreur lors de la génération du QR code");
        }
    };

    // Fonction pour fermer la modale
    const handleCloseQRModal = () => {
        setShowQRCode(false);
    };

    // Fonction pour géolocaliser l'utilisateur
    const handleGeolocation = () => {
        if (!navigator.geolocation) {
            toast.error("La géolocalisation n'est pas prise en charge par votre navigateur.");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setStart({ lat: latitude, lon: longitude });

                fetch(`https://api.tomtom.com/search/2/reverseGeocode/${latitude},${longitude}.json?key=${apiKey}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.addresses && data.addresses.length > 0) {
                            const address = data.addresses[0].address;
                            const formattedAddress = `${address.streetName || ''} ${address.municipalitySubdivision || ''} ${address.municipality || ''}`;
                            setStartAddress(formattedAddress);
                            toast.success("Position actuelle définie comme point de départ");
                        }
                    })
                    .catch(error => {
                        console.error("Erreur lors de la récupération de l'adresse:", error);
                    })
                    .finally(() => {
                        setIsLocating(false);
                    });
            },
            (error) => {
                console.error("Erreur de géolocalisation:", error);
                toast.error("Impossible d'obtenir votre position actuelle.");
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const handleTransportModeChange = (mode: TransportMode) => {
        setTransportMode(mode);
        if (start && end && showResults) {
            handleCalculateRoutes();
        }
    };

    const renderTransportModeSelector = () => (
        <div className="flex justify-center mb-4  p-2 rounded">
            <button
                onClick={() => handleTransportModeChange("car")}
                className={`mx-2 p-2 rounded ${transportMode === "car" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
                title="Voiture"
            >
                <MdDirectionsCar size={24} />
            </button>
            <button
                onClick={() => handleTransportModeChange("walk")}
                className={`mx-2 p-2 rounded ${transportMode === "walk" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
                title="À pied"
            >
                <MdDirectionsWalk size={24} />
            </button>
        </div>
    );

    return (
        <div className="relative">
            <h2 className="flex items-center">
                {showResults && (
                    <button
                        onClick={handleBackToSearch}
                        className="mr-2 p-1 rounded-full hover:bg-gray-200"
                        aria-label="Retour à la recherche"
                    >
                        <LuArrowLeft className="text-xl" />
                    </button>
                )}
                {showResults ? t("map.available-routes") : t("map.route-planner")}
            </h2>

            {!showResults && renderTransportModeSelector()}

            {!showResults ? (
                <>
                    <div className="relative mb-4">
                        <Search
                            onSearchResultSelect={(position: Coordinate, address?: string) => {
                                setStart(position);
                                if (address) setStartAddress(address);
                            }}
                        />
                    </div>
                    <Search
                        onSearchResultSelect={(position: Coordinate, address?: string) => {
                            setEnd(position);
                            if (address) setEndAddress(address);
                        }}
                    />

                    <div className="flex justify-center">
                        <button
                            style={{ backgroundColor: "#5DB3FF" }}
                            className="rounded-sm m-2 flex px-2 py-2 text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                            onClick={handleCalculateRoutes}
                            disabled={isLoading}
                        >
                            {isLoading ? "Calcul en cours..." : "Calculer les itinéraires"}
                        </button>
                    </div>
                </>
            ) : (
                <div className="route-options">
                    <div className="space-y-2">
                        {routeOptions.map((route) => (
                            <div
                                key={route.id}
                                className={`route-item p-3 border rounded cursor-pointer hover:bg-gray-100 ${selectedRouteId === route.id ? 'bg-blue-50 border-blue-300' : ''}`}
                                onClick={() => handleRouteSelect(route.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        {route.type === "fastest" ? (
                                            <LuRabbit className="text-xl mr-2" />
                                        ) : (
                                            <TbRoute2 className="text-xl mr-2" />
                                        )}
                                        <span className="font-medium">{route.name}</span>
                                    </div>
                                    {route.avoidTolls && (
                                        <TbBarrierBlockOff className="text-lg ml-2" />
                                    )}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    <span>{formatDistance(route.distance)}</span>
                                    <span className="mx-2">•</span>
                                    <span>{formatDuration(route.duration)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {role && <div className="flex justify-center mt-4 space-x-2">
                        <button
                            onClick={handleSaveRoute}
                            disabled={isSaving || !selectedRouteId}
                            className="rounded-sm px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 flex items-center"
                        >
                            <LuSave className="mr-2" />
                            {isSaving ? "Sauvegarde en cours..." : "Sauvegarder l'itinéraire"}
                        </button>

                        <button
                            onClick={handleGenerateQRCode}
                            disabled={!selectedRouteId}
                            className="rounded-sm px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 flex items-center"
                        >
                            <MdQrCode2 className="mr-2" />
                            Code QR
                        </button>
                    </div>}
                </div>
            )}

            {showQRCode && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Scannez ce code QR pour partager l'itinéraire</h3>
                            <button
                                onClick={handleCloseQRModal}
                                className="text-gray-500 hover:text-gray-700"
                                aria-label="Fermer"
                            >
                                <LuX size={24} />
                            </button>
                        </div>

                        <div className="flex justify-center mb-4">
                            <QRCodeSVG
                                value={qrCodeData}
                                size={250}
                                level="M" // Niveau de correction d'erreur
                                includeMargin={true}
                            />
                        </div>

                        <div className="text-center text-sm text-gray-500 mb-4">
                            <p>Ce QR code contient les informations de votre itinéraire</p>
                            <p>De: {startAddress}</p>
                            <p>À: {endAddress}</p>
                            <p>Mode de transport: {
                                transportMode === "car" ? "Voiture" :
                                    transportMode === "bike" ? "Vélo" : "À pied"
                            }</p>
                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={handleCloseQRModal}
                                className="rounded-sm px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoutePlanner;