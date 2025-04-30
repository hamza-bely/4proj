import AsyncStorage from '@react-native-async-storage/async-storage';

export default function asyncStorage() {
    
    // Stocker un token d'authentification
    const storeToken = async (token: string): Promise<void> => {
    try {
        await AsyncStorage.setItem('authToken', token);
    } catch (error) {
        console.error('Erreur lors du stockage du token :', error);
    }
    };

    // Récupérer un token d'authentification
    const getToken = async (): Promise<string | null> => {
    try {
        const token = await AsyncStorage.getItem('authToken');
        return token;
    } catch (error) {
        console.error('Erreur lors de la récupération du token :', error);
        return null;
    }
    };

    // Supprimer un token d'authentification
    const removeToken = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem('authToken');
    } catch (error) {
        console.error('Erreur lors de la suppression du token :', error);
    }
    };

    return {storeToken,getToken,removeToken,};
};
