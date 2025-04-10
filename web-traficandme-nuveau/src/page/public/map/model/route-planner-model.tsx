

export interface RouteOption {
    id: string;
    name: string;
    coordinates: Array<[number, number]>;
    distance: number;
    duration: number;
    type: "fastest" | "shortest" | "eco";
    avoidTolls: boolean;
}

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
}