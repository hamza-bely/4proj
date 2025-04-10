import axios, {AxiosError} from "axios";
import {toast} from "react-toastify";
import Cookies from "js-cookie";
import {
    UserCreateRequest,
    UserCreateResponse,
    UserResponseFetchUsers,
    UserUpdateResponse,
    UserUpdaterRequest
} from "../model/user.tsx";
const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
    const token = Cookies.get("authToken");
    return {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
    };
};


export const fetchUsers = async (): Promise<UserResponseFetchUsers> => {
    try {
        const response = await axios.get<UserResponseFetchUsers>(`${API_URL}admin/users/list`, { headers: getAuthHeaders() });
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

export const createUser = async (params: UserCreateRequest): Promise<UserCreateResponse> => {
    try {
        const response = await axios.post<UserCreateResponse>(API_URL +'admin/users/create', params, { headers: getAuthHeaders() });
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


export const updateUserByAdmin = async (id: number, params: UserUpdaterRequest): Promise<UserUpdateResponse> => {
    try {
        const response = await axios.put<UserUpdateResponse>(`${API_URL}admin/users/update/${id}`, params, { headers: getAuthHeaders() });
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

export const deleteUserFoAnAdmin  = async (id: number): Promise<any> => {
    try {
        const status = "DELETED"
        const response = await axios.patch(`${API_URL}admin/users/${id}/update-status`, status,{ headers: getAuthHeaders() });
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


export const deleteDefinitiveUserFoAnAdmin = async (id: number): Promise<any> => {
    try {
        const response = await axios.delete(`${API_URL}admin/users/${id}/delete-definitive`, { headers: getAuthHeaders() });
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