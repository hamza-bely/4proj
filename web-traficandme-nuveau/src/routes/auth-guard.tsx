import { Navigate } from "react-router-dom";
import {JSX} from "react";
import Cookies from "js-cookie";
const isAuthenticated = (token: string | undefined) => {

    if (!token) {
        return false;
    }

    try {
        if (token) {
            return true;
        }
    } catch (error) {
        console.error("Erreur de parsing des données utilisateur :", error);
        return false;
    }
};
const AuthGuard = ({ children }: { children: JSX.Element }) => {
    const token = Cookies.get("authToken");

    return isAuthenticated(token) ? children : <Navigate to="/" />;
};


export default AuthGuard;
