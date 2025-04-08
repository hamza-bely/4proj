"use client";

import React, { useState } from "react";
import "../css/map.css";
import { toast } from "react-toastify";
import Search from "./search-bar.tsx";
import { useTranslation } from "react-i18next";
import { LuRabbit, LuArrowLeft } from "react-icons/lu";
import {TbBarrierBlockOff, TbRoute2} from "react-icons/tb";

type Coordinate = {
    lat: number;
    lon: number;
};

type RouteResponse = {
    routes: Array<{
        summary: {
            lengthInMeters: number;
            travelTimeInSeconds: number;
            trafficDelayInSeconds: number;
        };
        legs: Array<{
            points: Array<{
                latitude: number;
                longitude: number;
            }>;
        }>;
    }>;
};

interface RouteOption {
    id: string;
    name: string;
    coordinates: Array<[number, number]>;
    distance: number;
    duration: number;
    type: "fastest" | "shortest" | "eco";
    avoidTolls: boolean;
}

interface RoutePlannerProps {
    onRouteCalculated: (route: string) => void;
}

const RoutePlanner: React.FC<RoutePlannerProps> = ({ onRouteCalculated }) => {
    const [start, setStart] = useState<Coordinate>({ lat: 47.6640, lon: 2.8357 });
    const [end, setEnd] = useState<Coordinate>({ lat: 45.7640, lon: 4.835 });
    const { t } = useTranslation();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [routeOptions, setRouteOptions] = useState<RouteOption[]>([]);
    const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

    const [showResults, setShowResults] = useState<boolean>(false);

    const apiKey: string = import.meta.env.VITE_TOMTOM_API_KEY;

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
        const avoid = avoidTolls ? "&avoid=tollRoads" : "";
        const url = `https://api.tomtom.com/routing/1/calculateRoute/${start.lat},${start.lon}:${end.lat},${end.lon}/json?key=${apiKey}&routeType=${routeType}${avoid}`;

        try {
            const response = await fetch(url);
            const data: RouteResponse = await response.json();

            if (data.routes.length > 0 && data.routes[0].legs.length > 0) {
                const route = data.routes[0];
                const points = route.legs[0].points;
                const coordinates = points.map((p) => [p.longitude, p.latitude] as [number, number]);

                const id = `${routeType}-${avoidTolls ? 'no-tolls' : 'with-tolls'}-${Date.now()}`;
                const name = `${routeType === 'fastest' ? t('map.fastest') : t('map.shortest')}${avoidTolls ? ` (${t('map.no-tolls')})` : ''}`;

                return {
                    id,
                    name,
                    coordinates,
                    distance: route.summary.lengthInMeters,
                    duration: route.summary.travelTimeInSeconds,
                    type: routeType,
                    avoidTolls
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

        setIsLoading(true);
        setRouteOptions([]);

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
                onRouteCalculated(JSON.stringify(validRoutes[0].coordinates));
                // Afficher les résultats et cacher les champs de recherche
                setShowResults(true);
            } else {
                toast.error("Aucun itinéraire trouvé");
            }
        } catch (error) {
            console.error("Erreur lors du calcul des itinéraires :", error);
            toast.error("Une erreur s'est produite lors du calcul des itinéraires.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRouteSelect = (routeId: string) => {
        const selectedRoute = routeOptions.find(route => route.id === routeId);
        if (selectedRoute) {
            setSelectedRouteId(routeId);
            onRouteCalculated(JSON.stringify(selectedRoute.coordinates));
        }
    };

    const handleBackToSearch = () => {
        setShowResults(false);
    };

    return (
        <div>
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

            {!showResults ? (
                <>
                    <Search
                        onSearchResultSelect={(position: Coordinate) => setStart(position)}

                    />
                    <Search
                        onSearchResultSelect={(position: Coordinate) => setEnd(position)}
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
                </div>
            )}
        </div>
    );
};

export default RoutePlanner;