
import { Report, ReportDeleteResponse, ReportFetchResponse } from "../model/report";
import { apiRequest } from "./generic-service";

export const fetchReports = async (): Promise<ReportFetchResponse> => {
    const data = await apiRequest("get", "reports/get-all");
    return data;
};

export const fetchReportsByUser = async (): Promise<ReportFetchResponse> => {
    const data = await apiRequest("get", "reports/get-all-by-user");
    return data;
};

export const createReport = async (reportData: any): Promise<Report> => {
    const data = await apiRequest("post", "reports/create", reportData);
    return data.data;
};

export const deleteReport = async (id: number): Promise<ReportDeleteResponse> => {
    const data = await apiRequest("delete", `reports/${id}/delete-definitive`);
    return data;
};

export const likeReport = async (id: number): Promise<Report> => {
    const data = await apiRequest("post", `reports/${id}/like`);
    return data.data;
};

export const dislikeReport = async (id: number): Promise<Report> => {
    const data = await apiRequest("post", `reports/${id}/dislike`);
    return data.data;
};

export const changeReportStatus = async (id: number, status: string): Promise<Report> => {
    const data = await apiRequest("patch", `reports/${id}/update-status`, status);
    return data.data;
};

export const changeReportType = async (id: number, type: string): Promise<Report> => {
    const data = await apiRequest("patch", `reports/${id}/update-type`, type);
    return data.data;
};
