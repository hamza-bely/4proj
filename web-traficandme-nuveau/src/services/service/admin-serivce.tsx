import axios from "axios";
import {toast} from "react-toastify";
import Cookies from "js-cookie";
import {
    AdminSumStats,
    UserCreateRequest,
    UserCreateResponse,
    UserResponseFetchUsers,
    UserUpdateResponse,
    UserUpdaterRequest
} from "../model/user.tsx";
import {translateMessage} from "../../assets/i18/translateMessage.tsx";
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
    } catch (error : any) {
        toast.error(await translateMessage(error.response.data.message || "An error has occurred"));
        throw error;
    }
};

export const createUser = async (params: UserCreateRequest): Promise<UserCreateResponse> => {
    try {
        const response = await axios.post<UserCreateResponse>(API_URL +'admin/users/create', params, { headers: getAuthHeaders() });
        toast.success(await translateMessage(response.data.message));
        return response.data;
    }catch (error : any) {
        toast.error(await translateMessage(error.response.data.message || "An error has occurred"));
        throw error;

    }
};


export const updateUserByAdmin = async (id: number, params: UserUpdaterRequest): Promise<UserUpdateResponse> => {
    try {
        const response = await axios.put<UserUpdateResponse>(`${API_URL}admin/users/update/${id}`, params, { headers: getAuthHeaders() });
        toast.success(await translateMessage(response.data.message));
        return response.data;
    }catch (error: any) {
        toast.error(await translateMessage(error.response.data.message || "An error has occurred"));
        throw error;

    }
};

export const deleteUserFoAnAdmin  = async (id: number): Promise<any> => {
    try {
        const status = "DELETED" //TODO
        const response = await axios.patch(`${API_URL}admin/users/${id}/update-status`, status,{ headers: getAuthHeaders() });
        toast.success(await translateMessage(response.data.message));
        return response.data;
    } catch (error: any) {
        toast.error(await translateMessage(error.response.data.message || "An error has occurred"));
        throw error;
    }
};


export const deleteDefinitiveUserFoAnAdmin = async (id: number): Promise<any> => {
    try {
        const response = await axios.delete(`${API_URL}admin/users/${id}/delete-definitive`, { headers: getAuthHeaders() });
        toast.success(await translateMessage(response.data.message));
        return response.data;
    } catch (error: any) {
        toast.error(await translateMessage(error.response.data.message || "An error has occurred"));
        throw error;
    }
};

export const fetchSumOfMapStatistic = async (): Promise<AdminSumStats> => {
    try {
        const response = await axios.get<AdminSumStats>(`${API_URL}admin/users/total-map`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error: any) {
        toast.error(await translateMessage(error.response.data.message || "An error has occurred"));
        throw error;
    }
};

export const fetchReportsByTypeStatistics = async (): Promise<any> => {
    try {
        const response = await axios.get<any>(`${API_URL}admin/users/report-statistics`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error: any) {
        toast.error(await translateMessage(error.response.data.message || "An error has occurred"));
        throw error;
    }
};

export const fetchRoutesByModeStatistics = async (): Promise<any> => {
    try {
        const response = await axios.get<any>(`${API_URL}admin/users/route-statistics`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error: any) {
        toast.error(await translateMessage(error.response.data.message || "An error has occurred"));
        throw error;
    }
};

export const fetchApiStatisticsPerTime = async (period: string): Promise<any> => {
    try {
        const response = await axios.get<any>(`${API_URL}admin/users/search-statistics`, { headers: getAuthHeaders(),params: { period } });
        return response.data;
    } catch (error: any) {
        toast.error(await translateMessage(error.response.data.message || "An error has occurred"));
        throw error;
    }
};
