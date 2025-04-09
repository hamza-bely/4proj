import axios, {AxiosError} from "axios";
import {toast} from "react-toastify";

import {
    UserLoginRequest, UserLoginResponse,
    UserRegisterRequest, UserRegisterResponse,
    UserResponseFetchUser, UserUpdateResponse, UserUpdaterRequest
} from "../model/user.tsx";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
    const token = Cookies.get("authToken");
    return {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
    };
};

export const register = async (params: UserRegisterRequest): Promise<UserRegisterResponse> => {
    try {
        const response = await axios.post<UserRegisterResponse>(API_URL +'auth/register', params);
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


export const login = async (params: UserLoginRequest): Promise<UserLoginResponse> => {
    try {
        const response = await axios.post<UserLoginResponse>(API_URL + `auth/authenticate`,params)
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

export const fetchUser = async (): Promise<UserResponseFetchUser> => {
    try {
        const response = await axios.get<UserResponseFetchUser>(`${API_URL}users/me`, { headers: getAuthHeaders() });
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


//TODO A FAIRE
export const updateUser = async ( params: UserUpdaterRequest): Promise<UserUpdateResponse> => {
    try {
        const response = await axios.put<UserUpdateResponse>(`${API_URL}users/update`, params, { headers: getAuthHeaders() });
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

export const deleteUserForAnUser = async (): Promise<void> => {
    try {
        const status = "DELETED"
        const response = await axios.patch(`${API_URL}users/update-status`,status, { headers: getAuthHeaders() });
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