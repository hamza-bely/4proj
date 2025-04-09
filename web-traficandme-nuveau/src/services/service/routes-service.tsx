import axios, {AxiosError} from "axios";
import {toast} from "react-toastify";
import Cookies from "js-cookie";
const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
    const token = Cookies.get("authToken");
    return {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
    };
};


export const fetchRoutes = async (): Promise<any> => {
    try {
        const response = await axios.get<any>(`${API_URL}traffic/get-all`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const errorMessage = error.response.data?.message || "Une erreur est survenue";
            console.error(errorMessage);
        } else {
            console.error("Erreur inconnue");
        }
        throw error;
    }
};

export const fetchRoutesByUser = async (): Promise<any> => {
    try {
        const response = await axios.get<any>(`${API_URL}traffic/user`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const errorMessage = error.response.data?.message || "Une erreur est survenue";
            console.error(errorMessage);
        } else {
            console.error("Erreur inconnue");
        }
        throw error;
    }
};


export const createRoute = async (params: any): Promise<any> => {
    try {
        const response = await axios.post<any>(API_URL +'traffic/create', params, { headers: getAuthHeaders() });
        toast.success(response.data.message);
        return response.data;
    }catch (error : any) {
        console.log(error)
        const errorData = error.response.data;
        if (errorData.errors && Array.isArray(errorData.errors)) {
            errorData.errors.forEach((err: any) => {
                if (err.msg) {
                    toast.error(err.msg);
                }
            });
        } else {
            toast.error(errorData.error||  error.response.data.error ||  error.response.data.message);
        }
        throw error;

    }
};


export const deleteRouteForAnUser = async (id : number): Promise<void> => {
    try {
        const response = await axios.delete(`${API_URL}traffic/${id}/delete-for-an-user`, { headers: getAuthHeaders() });
        toast.success(response.data.message);
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const errorMessage = error.response.data?.message || "Une erreur est survenue";
            toast.error(errorMessage);
        } else {
            toast.error("Erreur inconnue");
        }
        throw error;
    }
};

export const deleteDefinitiveRouteFoAnAdmin = async (id: number): Promise<any> => {
    try {
        const response = await axios.delete(`${API_URL}traffic/${id}/delete-definitive`, { headers: getAuthHeaders() });
        toast.success(response.data.message);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const errorMessage = error.response.data?.message || "Une erreur est survenue";
            toast.error(errorMessage);
        } else {
            toast.error("Erreur inconnue");
        }
        throw error;
    }
};

