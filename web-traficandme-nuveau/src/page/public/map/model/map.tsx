export interface RouteResponse {
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
}

export interface Coordinate {
    lat: number;
    lon: number;
}

export interface MarkerModel {
    type: string;
    latitude: number;
    longitude: number;
    status : string
}