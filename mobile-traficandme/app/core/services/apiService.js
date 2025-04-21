
import axios from 'axios';

const API_URL = 'http://158.180.229.244:8080';

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/authenticate`, {
            email,
            password,
        });
        return response.data;
    } catch (error) {

        const errorMessage = error.response?.data?.message || 'Erreur de connexion';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const registerUser = async (firstName, lastName, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/register`, {
            firstName,
            lastName,
            email,
            password,
        });
        return response.data;
    } catch (error) {

        const errorMessage = error.response?.data?.message || 'Erreur denregistrement';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};
