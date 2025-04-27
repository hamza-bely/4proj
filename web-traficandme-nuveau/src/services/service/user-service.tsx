import axios from "axios";
import {toast} from "react-toastify";

import {
    UserLoginRequest, UserLoginResponse,
    UserRegisterRequest, UserRegisterResponse,
     UserUpdateResponse, UserUpdaterRequest
} from "../model/user.tsx";
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

export const register = async (params: UserRegisterRequest): Promise<UserRegisterResponse> => {
    try {
        const response = await axios.post<UserRegisterResponse>(API_URL +'auth/register', params);
        toast.success(await translateMessage(response.data.message));
        return response.data;
    }catch (error : any) {
        toast.error(await translateMessage(error.response.data.message || "An error has occurred"));
        throw error;

    }
};


export const login = async (params: UserLoginRequest): Promise<UserLoginResponse> => {
    try {
        const response = await axios.post<UserLoginResponse>(API_URL + `auth/authenticate`,params)
        toast.success(await translateMessage(response.data.message));
        return response.data;
    } catch (error : any) {
        toast.error(await translateMessage(error.response.data.message || "An error has occurred"));
        throw error;
    }
};

export const fetchUser = async (): Promise<any> => {
    try {
        const response = await axios.get<any>(`${API_URL}users/me`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error: any) {
        toast.error(await translateMessage(error.response.data.message || "An error has occurred"));
        throw error;
    }
};


export const updateUser = async ( params: UserUpdaterRequest, id : number): Promise<UserUpdateResponse> => {
    try {
        const response = await axios.put<UserUpdateResponse>(`${API_URL}users/update/${id}`, params, { headers: getAuthHeaders() });
        toast.success(await translateMessage(response.data.message));
        return response.data;
    }catch (error: any) {
        toast.error(await translateMessage(error.response.data.message || "An error has occurred"));
        throw error;

    }
};

export const deleteUserForAnUser = async (): Promise<void> => {
    try {
        const status = "DELETED"
        const response = await axios.patch(`${API_URL}users/update-status`,status, { headers: getAuthHeaders() });
        toast.success(await translateMessage(response.data.message));
    } catch (error : any) {
        toast.error(await translateMessage(error.response.data.message || "An error has occurred"));
        throw error;
    }
};