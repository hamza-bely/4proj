
import axios from 'axios';
import * as Location from 'expo-location';
import NavigationInstruction from '@interfaces/NavigationInstruction';

const API_URL: string = 'http://158.180.229.244:8080';

const API_KEY = 'QBsKzG3zoRyZeec28eUDje0U8DeNoRSO';



export const loginUser = async (email: string, password: string): Promise<any> => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/authenticate`, {
            email,
            password,
        });
        return response.data;
    } catch (error: any) {
        const errorMessage: string = error.response?.data?.message || 'Erreur de connexion';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const registerUser = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
): Promise<any> => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/register`, {
            firstName,
            lastName,
            email,
            password,
        });
        return response.data;
    } catch (error: any) {
        const errorMessage: string = error.response?.data?.message || 'Erreur d\'enregistrement';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const fetchSuggestions = async (text: string) => {
    try {
        const response = await fetch(`https://api.tomtom.com/search/2/search/${encodeURIComponent(text)}.json?key=${API_KEY}&typeahead=true&limit=5`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Erreur lors de la récupération des suggestions :', error);
        throw error;
    }
};

export const fetchRouteOption = async (destination: { latitude: number; longitude: number }) => {
    try {
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        const response = await fetch(
            `https://api.tomtom.com/routing/1/calculateRoute/${latitude},${longitude}:${destination.latitude},${destination.longitude}/json?key=${API_KEY}&routeType=fastest&maxAlternatives=3&instructionsType=text&language=fr`
        );
        const data = await response.json();
        return data.routes;
    } catch (error) {
        console.error('Erreur lors de la récupération des itinéraires :', error);
        throw error;
    }
};