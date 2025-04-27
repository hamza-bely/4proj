import { toast } from "react-toastify";
import axios from "axios";
import {Coordinate, Instruction, RouteOption} from "../model/map";

const KEY = import.meta.env.VITE_TOMTOM_API_KEY;
const API_TOM_TOM = 'https://api.tomtom.com/'

const API_KEY: string = import.meta.env.VITE_TOMTOM_API_KEY;

export const searchAddress = async (query: any): Promise<any> => {
    const url = `${API_TOM_TOM}search/2/search/${encodeURIComponent(query)}.json?key=${KEY}&limit=5`;

    try {
        const response = await axios.get<any>(url);
        return response.data;
    } catch (error) {
        toast.error("Error fetching route information");
        console.log(error);
        throw error;
    }
};

export type TransportMode = "car" | "bike" | "walk" | "bus";


const convertTransportMode = (mode: TransportMode): string => {
    switch (mode) {
        case "bike":
            return "bicycle";
        case "walk":
            return "pedestrian";
        case "bus":
            return "truck";
        default:
            return "car";
    }
};

export const getCoordinatesFromAddress = async (address: string): Promise<Coordinate | null> => {
    const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(address)}.json?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const position = data.results[0].position;
            return { lat: position.lat, lon: position.lon };
        }
        return null;
    } catch (error) {
        console.error("Error getting coordinates from address:", error);
        return null;
    }
};


 const calculateRoute = async (
    start: Coordinate,
    end: Coordinate,
    routeType: "fastest" | "shortest",
    avoidTolls: boolean,
    transportMode: TransportMode,
    routeNameTranslations: { fastest: string, shortest: string, noTolls: string }
): Promise<RouteOption | null> => {
    const travelMode = convertTransportMode(transportMode);
    const shouldAvoidTolls = avoidTolls && transportMode !== "walk";
    const avoid = shouldAvoidTolls ? "&avoid=tollRoads" : "";

    const url = `https://api.tomtom.com/routing/1/calculateRoute/${start.lat},${start.lon}:${end.lat},${end.lon}/json?key=${API_KEY}&routeType=${routeType}${avoid}&travelMode=${travelMode}&instructionsType=text`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.routes.length > 0 && data.routes[0].legs.length > 0) {
            const route = data.routes[0];
            const points = route.legs[0].points;
            const coordinates = points.map((p: { longitude: number; latitude: number; }) => [p.longitude, p.latitude] as [number, number]);

            const instructions: Instruction[] = [];

            if (route.guidance && route.guidance.instructions) {
                route.guidance.instructions.forEach((instruction: { message: any; routeOffsetInMeters: any; travelTimeInSeconds: any; }) => {
                    instructions.push({
                        message: instruction.message || "",
                        distance: instruction.routeOffsetInMeters || 0,
                        duration: instruction.travelTimeInSeconds || 0
                    });
                });
            }

            const id = `${routeType}-${shouldAvoidTolls ? 'no-tolls' : 'with-tolls'}-${travelMode}-${Date.now()}`;
            const name = `${routeType === 'fastest' ? routeNameTranslations.fastest : routeNameTranslations.shortest}${shouldAvoidTolls ? ` (${routeNameTranslations.noTolls})` : ''}`;

            return {
                id,
                name,
                coordinates,
                distance: route.summary.lengthInMeters,
                duration: route.summary.travelTimeInSeconds,
                type: routeType,
                avoidTolls: shouldAvoidTolls,
                instructions: instructions
            };
        }
        return null;
    } catch (error) {
        console.error("Error calculating route:", error);
        return null;
    }
};


export const calculateRoutes = async (
    start: Coordinate,
    end: Coordinate,
    transportMode: TransportMode,
    routeNameTranslations: { fastest: string, shortest: string, noTolls: string }
): Promise<RouteOption[]> => {
    try {
        let routePromises = [];
        if (transportMode === "walk") {
            routePromises = [
                calculateRoute(start, end, "fastest", false, transportMode, routeNameTranslations),
                calculateRoute(start, end, "shortest", false, transportMode, routeNameTranslations)
            ];
        } else {
            routePromises = [
                calculateRoute(start, end, "fastest", false, transportMode, routeNameTranslations),
                calculateRoute(start, end, "shortest", false, transportMode, routeNameTranslations),
                calculateRoute(start, end, "fastest", true, transportMode, routeNameTranslations),
                calculateRoute(start, end, "shortest", true, transportMode, routeNameTranslations)
            ];
        }

        const results = await Promise.all(routePromises);
        return results.filter(route => route !== null) as RouteOption[];
    } catch (error) {
        console.error("Error calculating routes:", error);
        return [];
    }
};

export async function getAddressFromCoordinates(latitude: number, longitude: number,t: any): Promise<string> {
    const apiKey = import.meta.env.VITE_TOMTOM_API_KEY;
    const url = `https://api.tomtom.com/search/2/reverseGeocode/${latitude},${longitude}.json?key=${apiKey}&language=fr-FR`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.addresses && data.addresses.length > 0) {
            const address = data.addresses[0].address;
            const formattedAddress = [
                address.streetNumber,
                address.streetName,
                address.municipalitySubdivision,
                address.municipality,
                address.postalCode,
                address.countrySubdivision
            ].filter(Boolean).join(", ");

            return formattedAddress;
        }
        return "Adresse inconnue";
    } catch (error) {
        toast.error(t("error-global"));
        return "Erreur lors de la récupération de l'adresse";
    }
}
