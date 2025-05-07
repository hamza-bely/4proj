// Supposons que ce fichier est dans /services/api.js

import axios from 'axios';

// Configuration de l'API
const API_URL = 'http://204.216.214.8:8080/';
const TOMTOM_API_KEY = '9zc7scbLhpcrEFouo0xJWt0jep9qNlnv';
const TOMTOM_API_URL = 'https://api.tomtom.com';

// Création des instances axios
export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

export const tomtomApi = axios.create({
  baseURL: TOMTOM_API_URL,
  timeout: 15000,
  params: {
    key: TOMTOM_API_KEY,
  },
});

export const calculateRoute = async (startCoords, endCoords, options = {}) => {
  try {
    const defaultOptions = {
      routeType: 'fastest',  // fastest, shortest, eco, thrilling
      traffic: true,
      avoid: '',             // toll, motorway, ferry, etc.
      travelMode: 'car',
      vehicleCommercial: false,
      instructionsType: 'text',
      detail: 'true',
      report: 'effectiveSettings',
    };

    const finalOptions = { ...defaultOptions, ...options };

    const response = await tomtomApi.get(`/routing/1/calculateRoute/${startCoords}:${endCoords}/json`, {
      params: finalOptions
    });

    return response.data;
  } catch (error) {
    console.error('Error in calculateRoute:', error);
    throw error;
  }
};


// Fonction améliorée pour le géocodage inverse
export const reverseGeocode = async (latitude, longitude) => {
  try {
    // Ajout de paramètres supplémentaires pour améliorer la précision
    const response = await tomtomApi.get(`/search/2/reverseGeocode/${latitude},${longitude}.json`, {
      params: {
        radius: 100,         // Rayon de recherche en mètres
        returnSpeedLimit: false,
        returnRoadUse: false,
        extendedPostalCodesFor: 'Addr', // Codes postaux étendus pour les adresses
        language: 'fr-FR',    // Langue française
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error in reverseGeocode:', error);
    throw error;
  }
};

// Fonction améliorée pour la recherche d'adresses
export const searchAddresses = async (query, options = {}) => {
  try {
    const defaultOptions = {
      limit: 7,
      countrySet: 'FR',    // Par défaut à la France, peut être modifié
      language: 'fr-FR',   // Langue française
      typeahead: true,     // Suggestions pendant la saisie
      idxSet: 'Geo',       // Recherche géographique
    };

    const finalOptions = { ...defaultOptions, ...options };

    const response = await tomtomApi.get('/search/2/search/' + encodeURIComponent(query) + '.json', {
      params: finalOptions
    });

    return response.data;
  } catch (error) {
    console.error('Error in searchAddresses:', error);
    throw error;
  }
};

// Fonction pour générer une URL Google Maps
export const generateGoogleMapsUrl = (startLat, startLon, endLat, endLon, options = {}) => {
  const baseUrl = 'https://www.google.com/maps/dir/';

  const travelMode = options.travelMode || 'driving'; // driving, walking, bicycling, transit
  const avoid = options.avoid || ''; // tolls, highways, ferries

  // Construire l'URL avec les paramètres
  let url = `${baseUrl}?api=1&origin=${startLat},${startLon}&destination=${endLat},${endLon}&travelmode=${travelMode}`;

  // Ajouter les options d'évitement si nécessaire
  if (avoid) {
    url += `&avoid=${avoid}`;
  }

  return url;
};
export const getRouteSummary = async (start: string, end: string, options: any = {}) => {
  const { avoid = [], transportMode = 'car' } = options;
  
  try {
    const response = await tomtomApi.get('/routing/1/calculateRoute/' + start + ':' + end + '/json', {
      params: {
        avoid: avoid.join(','),
        travelMode: transportMode,
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching route:', error);
    throw error;
  }
};



export const searchAddress = async (query: string) => {
  try {
    const response = await tomtomApi.get('/search/2/search/' + encodeURIComponent(query) + '.json');
    return response.data;
  } catch (error) {
    console.error('Error searching address:', error);
    throw error;
  }
};