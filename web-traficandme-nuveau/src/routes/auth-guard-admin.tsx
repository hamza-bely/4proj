import { Navigate } from "react-router-dom";
import {JSX, useEffect, useState} from "react";
import {getUserRole} from "../services/service/token-service.tsx";
import Cookies from "js-cookie";
const isAuthenticated = (role: string | string[] | null) => {

    if (!role) {
        return false;
    }

    try {
        return role === "ROLE_ADMIN" ;
    } catch (error) {
        console.error("Erreur de parsing des données utilisateur :", error);
        return false;
    }
};
const AuthGuard = ({ children }: { children: JSX.Element }) => {
    const [role, setRole] = useState<string | string[] | null>(null);
    const token = Cookies.get("authToken");

    useEffect(() => {
        setRole(getUserRole());
    }, [token]);
    //TODO  A SUPPRIME
    return isAuthenticated("ROLE_ADMIN") ? children : <Navigate to="/" />;
};


export default AuthGuard;
