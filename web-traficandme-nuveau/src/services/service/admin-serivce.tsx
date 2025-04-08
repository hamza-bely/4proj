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



export const deleteUserFoAnAdmin  = async (id: number): Promise<any> => {
    try {
        const status = "DELETED"
        const response = await axios.patch(`${API_URL}admin/users/${id}/update-status`, status,{ headers: getAuthHeaders() });
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


export const deleteDefinitiveUserFoAnAdmin = async (id: number): Promise<any> => {
    try {
        const response = await axios.delete(`${API_URL}admin/users/${id}/delete-definitive`, { headers: getAuthHeaders() });
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