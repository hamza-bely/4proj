import {jwtDecode} from "jwt-decode";
import Cookies from "js-cookie";

// Définir le type du payload du JWT (ajuste selon la structure de ton JWT)
interface JwtPayload {
    role?: string;  // Si c'est une seule chaîne de rôle
    roles?: string[]; // Si c'est un tableau de rôles
    exp?: number; // Expiration du token
}

// Fonction pour récupérer le rôle depuis le token
export const getUserRole = (): string | string[] | null => {
    const token = Cookies.get("authToken");

    if (!token) return null;

    try {
        console.log(token)
        const decodedToken: JwtPayload = jwtDecode(token);

        if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
            console.warn("Token expiré !");
            Cookies.remove("authToken");
            return null;
        }

        return decodedToken.role || decodedToken.roles || null;

    } catch (error) {
        console.error("Erreur lors du décodage du token:", error);
        return null;
    }
};
