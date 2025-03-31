import axios, {AxiosError} from "axios";
import {toast} from "react-toastify";
import {UserLoginRequest, UserRegisterRequest} from "../model/user.tsx";
import Cookies from "js-cookie";


const API_URL = import.meta.env.VITE_API_URL;
const token = Cookies.get("authToken");

const getAuthHeaders = () => ({
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
});

/*const token = Cookies.get("authToken");

const response = await fetch("/api/protected-route", {
    method: "GET",
    headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    }
});*/


export const register = async (params: UserRegisterRequest): Promise<any> => {
    try {
        const response = await axios.post<any>(API_URL +'auth/register', params);
        console.log(response)
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

export const login = async (params: UserLoginRequest): Promise<any> => {
    try {
        const response = await axios.post<any>(API_URL + `auth/authenticate`,params)
        toast.success(response.data.message);
        return response.data;
    } catch (error : any) {
        const errorData = error.response.data;
        if (errorData.errors && Array.isArray(errorData.errors)) {
            errorData.errors.forEach((err: any) => {
                if (err.msg) {
                    toast.error(err.msg);
                }
            });
        } else {
            toast.error(errorData.error ||  error.response.data.message ||  error.response.data.message);
        }
        throw error;
    }
};

export const fetchUser = async (): Promise<any> => {
    try {
        const response = await axios.get<any>(`${API_URL}users/profile `, { headers: getAuthHeaders() });
        toast.success(response.data.message);
        console.log(response)
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

export const fetchUsers = async (): Promise<any> => {
    try {
        const response = await axios.get<any>(`${API_URL}users/list`, { headers: getAuthHeaders() });
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

export const updateUser = async (id: string, params: any): Promise<any> => {
    try {
        console.log(params)
        const response = await axios.put<any>(`${API_URL}users/profile/${id}`, params, { headers: getAuthHeaders() });
        toast.success(response.data.message);
        return response.data;

    }catch (error) {
        if (error instanceof AxiosError && error.response) {
            const errorMessage = error.response.data?.message || "Une erreur est survenue";
            toast.error(errorMessage);
        } else {
            toast.error("Erreur inconnue");
        }
        throw error;

    }
};

export const deleteUser = async (id: string): Promise<void> => {
    try {
        const response = await axios.delete(`${API_URL}users/${id}`, { headers: getAuthHeaders() });
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