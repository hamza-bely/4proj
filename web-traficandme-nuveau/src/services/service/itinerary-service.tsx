import axios from "axios";
import {toast} from "react-toastify";
import Cookies from "js-cookie";
import {translateMessage} from "../../assets/i18/translateMessage.tsx";
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
    } catch (error: any) {
        toast.error(await translateMessage(error.response.data.message || "An error has occurred"));
        throw error;
    }
};

export const fetchRoutesByUser = async (): Promise<any> => {
    try {
        const response = await axios.get<any>(`${API_URL}traffic/user`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error: any) {
        toast.error(await translateMessage(error.response.data.message || "An error has occurred"));
        throw error;
    }
};


export const createRoute = async (params: any): Promise<any> => {
    try {
        const response = await axios.post<any>(API_URL +'traffic/create', params, { headers: getAuthHeaders() });
        toast.success(await translateMessage(response.data.message));
        return response.data;
    }catch (error : any) {
        toast.error(await translateMessage(error.response.data.message || "An error has occurred"));
        throw error;

    }
};


export const deleteRouteForAnUser = async (id : number): Promise<void> => {
    try {
        const response = await axios.delete(`${API_URL}traffic/${id}/delete-for-an-user`, { headers: getAuthHeaders() });
        toast.success(await translateMessage(response.data.message));
    } catch (error: any) {
        toast.error(await translateMessage(error.response.data.message || "An error has occurred"));
        throw error;
    }
};

export const deleteDefinitiveRouteFoAnAdmin = async (id: number): Promise<any> => {
    try {
        const response = await axios.delete(`${API_URL}traffic/${id}/delete-definitive`, { headers: getAuthHeaders() });
        toast.success(await translateMessage(response.data.message));
        return response.data;
    } catch (error: any) {
        toast.error(await translateMessage(error.response.data.message || "An error has occurred"));
        throw error;
    }
};

