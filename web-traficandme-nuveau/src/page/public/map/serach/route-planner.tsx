"use client";

import React, { useState } from "react";
import "../map.css";
import { toast } from "react-toastify";
import Search from "./search-bar.tsx";
import { Switch } from "@headlessui/react";
import {useTranslation} from "react-i18next";
import { FaCar } from "react-icons/fa";
import {MdFilterListAlt} from "react-icons/md";
import {LuRabbit, LuTurtle} from "react-icons/lu";
import {TbBarrierBlockOff} from "react-icons/tb";


type RouteResponse = {
    routes: Array<{
        legs: Array<{
            points: string;
        }>;
    }>;
};

interface RoutePlannerProps {
        onRouteCalculated: (route: string) => void;
}

const RoutePlanner: React.FC<RoutePlannerProps> = ({ onRouteCalculated }) => {
    const [start, setStart] = useState<{ lat: number; lon: number }>({ lat: 47.7640, lon: 2.8357 }); // Coordonnées de départ (Paris)
    const [end, setEnd] = useState<{ lat: number; lon: number }>({ lat: 45.7640, lon: 4.835 }); // Coordonnées d'arrivée (Lyon)
    const { t } = useTranslation();
    //const [start, setStart] = useState<{ lat: number; lon: number } | null>(null);
    //const [end, setEnd] = useState<{ lat: number; lon: number } | null>(null);
    const [mode, setMode] = useState<string>("fastest");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [enabled, setEnabled] = useState(false)
    const [filter, setFilter] = useState(false)

    const apiKey = import.meta.env.VITE_TOMTOM_API_KEY;

    const handleCalculateRoute = async () => {
        if (!start || !end) {
            toast.error("Veuillez sélectionner un point de départ et une destination.");
            return;
        }
        
        setIsLoading(true);
        console.log(enabled)
        let avoid : string = ""
        if(enabled){
            avoid  = ""
        }else{
            avoid = "&avoid=tollRoads"
        }

        const url = `https://api.tomtom.com/routing/1/calculateRoute/${start.lat},${start.lon}:${end.lat},${end.lon}/json?key=${apiKey}&routeType=${mode}${avoid}`;

        try {
            const response = await fetch(url);
            const data: RouteResponse = await response.json();

            if (data.routes.length > 0) {
                const points = data.routes[0].legs[0].points;
                const coordinates = points.map((p) => [p.longitude, p.latitude]);
                onRouteCalculated(JSON.stringify(coordinates));
            } else {
                toast.error("Aucun itinéraire trouvé");
            }
        } catch (error) {
            console.error("Erreur lors du calcul de l'itinéraire :", error);
            toast.error("Une erreur s'est produite lors du calcul de l'itinéraire.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2>{t('map.route-planner')}</h2>
            <MdFilterListAlt style={{fontSize : "20px"}} onClick={() => setFilter(!filter)} />
            {filter &&
            <div className="select-container flex mt-2">
                <div
                    className={`mode-select ${mode === "fastest" ? "selected" : ""}`}
                    onClick={() => setMode("fastest")}
                >
                    <LuRabbit />
                </div>
                <div
                    className={`mode-select ${mode === "shortest" ? "selected" : ""}`}
                    onClick={() => setMode("shortest")}
                >
                    <LuTurtle />
                </div>
                <div className="m-1 container-toll">
                    <TbBarrierBlockOff />

                    <Switch
                        checked={enabled}
                        onChange={setEnabled}
                        className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:outline-hidden data-checked:bg-indigo-600"
                    >
                        <span className="sr-only"></span>
                        <span
                            aria-hidden="true"
                            className="pointer-events-none inline-block size-5 transform rounded-full bg-white ring-0 shadow-sm transition duration-200 ease-in-out group-data-checked:translate-x-5"
                        />
                    </Switch>
                </div>

            </div>
            }
            <Search
                onSearchResultSelect={(position) => setStart(position)}
            />
            <Search
                onSearchResultSelect={(position) => setEnd(position)}
            />
            <div className="flex justify-center">
                <button
                    style={{backgroundColor : "#5DB3FF"}}
                    className="rounded-sm m-2 flex  px-2 py-2 text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                    onClick={handleCalculateRoute}
                    disabled={isLoading}
                >
                    {isLoading ? "Calcul en cours..." : "Calculer l'itinéraire"}
                </button>
            </div>

        </div>
    );
};

export default RoutePlanner;