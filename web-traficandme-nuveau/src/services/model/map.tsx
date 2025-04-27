export interface Coordinate {
    lat: number;
    lon: number;
}

export interface Instruction {
    message: string;
    distance: number;
    duration: number;
}

export interface RouteOption {
    id: string;
    name: string;
    coordinates: [number, number][];
    distance: number;
    duration: number;
    type: "fastest" | "shortest";
    avoidTolls: boolean;
    instructions?: Instruction[];
}
