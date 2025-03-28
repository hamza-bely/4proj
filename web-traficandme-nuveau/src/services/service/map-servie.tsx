import { toast } from "react-toastify";
import axios from "axios";

const KEY = import.meta.env.VITE_TOMTOM_API_KEY;
const API_TOM_TOM = 'https://api.tomtom.com/'

const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("user_token")}`,
    "Content-Type": "application/json",
});


export const calculateRoute = async (startCoords: number[], endCoords: number[], mode: string): Promise<any> => {
    const url = `${API_TOM_TOM}/routing/1/calculateRoute/${startCoords[0]},${startCoords[1]}:${endCoords[0]},${endCoords[1]}/json?key=${KEY}&routeType=${mode}`;

    try {
        const response = await axios.get<any>(url);
        return response.data;
    } catch (error) {
        toast.error("Error fetching route information");
        console.log(error);
        throw error;
    }
};

export const searchAddress = async (query: any): Promise<any> => {
    console.log(query)
    const url = `${API_TOM_TOM}search/2/search/${encodeURIComponent(query)}.json?key=${KEY}&limit=4`;

    try {
        const response = await axios.get<any>(url);
        console.log(response);
        return response.data;
    } catch (error) {
        toast.error("Error fetching route information");
        console.log(error);
        throw error;
    }
};

