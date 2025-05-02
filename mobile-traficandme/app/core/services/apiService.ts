import axios from 'axios';
import * as Location from 'expo-location';
import  ReportData  from '@interfaces/ReportData';


const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;
const EXPO_PUBLIC_TOMTOM_API_KEY = process.env.EXPO_PUBLIC_TOMTOM_API_KEY;


export const loginUser = async (email: string, password: string): Promise<any> => {

    try {
        const response = await axios.post(`${EXPO_PUBLIC_API_URL}/api/auth/authenticate`, {
            email,
            password,
        });
        return response.data;
        console.log('Détail de la réponse :', response.data);
    } catch (error: any) {
        const errorMessage: string = error.response?.data?.message || 'Erreur de connexion';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const registerUser = async (firstName: string,lastName: string,email: string,password: string): Promise<any> => {
    try {
        const response = await axios.post(`${EXPO_PUBLIC_API_URL}/api/auth/register`, {
            firstName,
            lastName,
            email,
            password,
        });
        return response.data;
    } catch (error: any) {
        const errorMessage: any = error.response?.data?.message || 'Erreur d\'enregistrement';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const fetchSuggestions = async (text: string) => {
    try {
        const response = await fetch(`https://api.tomtom.com/search/2/search/${encodeURIComponent(text)}.json?key=${EXPO_PUBLIC_TOMTOM_API_KEY}&typeahead=true&limit=5`);
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
            `https://api.tomtom.com/routing/1/calculateRoute/${latitude},${longitude}:${destination.latitude},${destination.longitude}/json?key=${EXPO_PUBLIC_TOMTOM_API_KEY}&routeType=fastest&maxAlternatives=3&instructionsType=text&language=fr`
        );
        const data = await response.json();
        return data.routes;
    } catch (error) {
        console.error('Erreur lors de la récupération des itinéraires :', error);
        throw error;
    }
};


export const createReport = async (reportData: ReportData): Promise<void> => {
    try {
        const response = await fetch(`${EXPO_PUBLIC_API_URL}/api/reports/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reportData),
        });

        const responseBody = await response.json();

        if (!response.ok) {
            console.error('Erreur retournée par le serveur:', responseBody);
            throw new Error(responseBody.message || 'Erreur lors de la création du rapport');
        }

        console.log('Rapport créé avec succès :', responseBody);
    } catch (error) {
        console.error('Erreur lors de l\'appel API :', error);
        throw error;
    }
};


export const fetchReports = async (): Promise<ReportData[]> => {
    try {
        const response = await fetch(`${EXPO_PUBLIC_API_URL}/api/reports`, {
            method: 'GET',
            headers: {
            'Accept': 'application/json',
            },
        });
    
        if (response.status === 204) {
            return [];
        }

        const text = await response.text();
    
        if (!text) {
            return [];
        }
    
        const body = JSON.parse(text) as { data: ReportData[]; message?: string };
    
        if (!response.ok) {
            console.error('Erreur retournée par le serveur:', body);
            throw new Error(body.message || 'Erreur lors de la récupération des rapports');
        }
    
        return body.data || [];
        } 
    catch (err) {
        console.error("Erreur lors de l'appel API fetchReports :", err);
        throw err;
    }
};




