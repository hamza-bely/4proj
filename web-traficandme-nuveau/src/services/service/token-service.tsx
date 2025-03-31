import {jwtDecode} from "jwt-decode";
import Cookies from "js-cookie";

interface JwtPayload {
    role?: string;
    roles?: string[];
    exp?: number;
}

export const getUserRole = (): string | string[] | null => {
    const token = Cookies.get("authToken");

    if (!token) return null;

    try {
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
