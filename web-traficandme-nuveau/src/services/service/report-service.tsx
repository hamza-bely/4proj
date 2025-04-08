import axios, {AxiosError} from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import {Report, ReportDeleteResponse, ReportFetchResponse} from "../model/report";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
    const token = Cookies.get("authToken");
    return {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
    };
};

export const fetchReports = async (): Promise<ReportFetchResponse> => {
    try {
        const response = await axios.get<ReportFetchResponse>(`${API_URL}reports/get-all`, { headers: getAuthHeaders() });
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

export const fetchReportsByUser = async (): Promise<ReportFetchResponse> => {
    try {
        const response = await axios.get<ReportFetchResponse>(`${API_URL}reports/get-all-by-user`, { headers: getAuthHeaders() });
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

export const createReport = async (data: any): Promise<Report> => {
    try {
        const response = await axios.post(`${API_URL}reports/create`, data, {
            headers: getAuthHeaders(),
        });
        toast.success("Votre alerte a été invitée à l'administration pour être évaluée");
        return response.data.data;
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Error creating report");
        throw error;
    }
};

export const deleteReport = async (id: number): Promise<ReportDeleteResponse> => {
    try {
        const response = await  axios.delete(`${API_URL}reports/${id}/delete`, {
            headers: getAuthHeaders(),
        });
        console.log(response.data.message)
        toast.success(response.data.message);
        return response.data;
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Error deleting report");
        throw error;
    }
};

export const likeReport = async (id: number): Promise<Report> => {
    try {
        const response = await axios.post(`${API_URL}reports/${id}/like`, {}, {
            headers: getAuthHeaders(),
        });
        toast.success(response.data.message)
        return response.data.data;
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Error liking report");
        throw error;
    }
};

export const dislikeReport = async (id: number): Promise<Report> => {
    try {
        const response = await axios.post(`${API_URL}reports/${id}/dislike`, {}, {
            headers: getAuthHeaders(),
        });
        toast.success(response.data.message)
        return response.data.data;
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Error disliking report");
        throw error;
    }
};

export const changeReportStatus = async (id: number, status: string): Promise<Report> => {
    try {
        const response = await axios.patch(`${API_URL}reports/${id}/update-status`,status , {
            headers: getAuthHeaders(),
        });
        toast.success(response.data.message);
        return response.data.data;
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Error updating status");
        throw error;
    }
};

export const changeReportType = async (id: number, type: string): Promise<Report> => {
    try {
        const response = await axios.patch(`${API_URL}reports/${id}/update-type`,  type , {
            headers: getAuthHeaders(),
        });
        toast.success(response.data.message);
        return response.data.data;
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Error updating status");
        throw error;
    }
};
