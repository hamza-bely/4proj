import axios, {AxiosError} from "axios";
import {toast} from "react-toastify";
import {
    UserComplete,
    UserCreateRequest, UserCreateResponse,
    UserLoginRequest, UserLoginResponse,
    UserRegisterRequest, UserRegisterResponse,
    UserResponseFetchUser, UserResponseFetchUsers, UserUpdateResponse
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

export const createUser = async (params: UserCreateRequest): Promise<UserCreateResponse> => {
    try {
        const response = await axios.post<UserCreateResponse>(API_URL +'users/create', params, { headers: getAuthHeaders() });
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
            toast.error(errorMessage);
        } else {
            toast.error("Erreur inconnue");
        }
        throw error;
    }
};

export const fetchUsers = async (): Promise<UserResponseFetchUsers> => {
    try {
        const response = await axios.get<UserResponseFetchUsers>(`${API_URL}users/list`, { headers: getAuthHeaders() });
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

export const updateUser = async (id: number, params: UserComplete): Promise<UserUpdateResponse> => {
    try {
        console.log(params)
        const response = await axios.put<UserUpdateResponse>(`${API_URL}users/update/${id}`, params, { headers: getAuthHeaders() });
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