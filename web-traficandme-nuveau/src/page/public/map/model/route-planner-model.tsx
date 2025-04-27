import React from "react";




export interface RouteSaveData {
    startLongitude: string;
    startLatitude: string;
    endLongitude: string;
    endLatitude: string;
    address_start: string;
    address_end: string;
    user: string;
    mode: string;
    peage: boolean;
}

export interface RoutePlannerProps {
    onRouteCalculated: (route: string) => void;
    startAddress: string;
}

export interface RouteOption {
    id: string;
    name: string;
    type: string;
    avoidTolls: boolean;
    distance: number;
    duration: number;
    coordinates: Array<[number, number]>;
    instructions?: Array<{
        message: React.ReactNode;
        distance: number;
        duration: number;
    }>;
}
