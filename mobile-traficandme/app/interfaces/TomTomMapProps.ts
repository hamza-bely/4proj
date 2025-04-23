export default interface TomTomMapProps {
    destination?: { latitude: number; longitude: number } | null;
    routeOptions?: any[];
    selectedRoute?: any;
}