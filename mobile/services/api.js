import axios from 'axios';

export const API_URL = process.env.EXPO_PUBLIC_API_URL;
export const TOMTOM_API_KEY = process.env.EXPO_PUBLIC_TOMTOM_API_KEY;
export const TOMTOM_API_URL = process.env.EXPO_PUBLIC_TOMTOM_API_URL;

console.log(API_URL)

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

export const tomtomApi = axios.create({
  baseURL: TOMTOM_API_URL,
  timeout: 15000,
  params: {
    key: TOMTOM_API_KEY,
    language: 'fr-FR'
  },
});

export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await tomtomApi.get(`/search/2/reverseGeocode/${latitude},${longitude}.json`, {
      params: {
        radius: 100,
        returnSpeedLimit: false,
        returnRoadUse: false,
        extendedPostalCodesFor: 'Addr',
        language: 'fr-FR',
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error in reverseGeocode:', error);
    throw error;
  }
};