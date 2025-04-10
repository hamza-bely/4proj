import {
    createReport,
    deleteReport,
    likeReport,
    dislikeReport,
    changeReportStatus, fetchReports, changeReportType, fetchReportsByUser
} from "../service/report-service.tsx";

import {create} from "zustand/react";
import {Report}  from "../model/report.tsx"
interface ReportState {
    reports: Report[];
    report: Report | null;
    reportsUser :  Report[];
    fetchReportsByUser: () => Promise<void>;

    fetchReports: () => Promise<void>;
    createReport: (data: any) => Promise<void>;
    deleteReport: (id: number) => Promise<void>;
    likeReport: (id: number) => Promise<Report>;
    dislikeReport: (id: number) => Promise<Report>;
    changeReportStatus: (id: number, status: string) => Promise<Report>;
    changeReportType: (id: number, status: string) => Promise<void>;
}

const useReportStore = create<ReportState>((set, get) => ({
    reports: [],
    report: null,
    reportsUser : [],

    fetchReports: async () => {
            const response = await fetchReports();
            set({ reports: response.data });
    },

    fetchReportsByUser: async () => {
            const response = await fetchReportsByUser();
            set({ reportsUser: response.data });
    },

    createReport: async (data) => {
        const report = await createReport(data);
        console.log(report)
        set({ reports: [...get().reports, report] });
    },

    likeReport: async (id) => {
        const updated = await likeReport(id);
        set({
            reports: get().reports.map((r) => (r.id === id ? updated : r)),
        });
        return updated;
    },

    dislikeReport: async (id) => {
        const updated = await dislikeReport(id);
        set({
            reports: get().reports.map((r) => (r.id === id ? updated : r)),
        });
        return updated;
    },

    changeReportStatus: async (id, status) => {
        const updated = await changeReportStatus(id, status);
        set({
            reports: get().reports.map((r) => (r.id === id ? updated : r)),
        });
        return updated;
    },

    changeReportType: async (id, status) => {
        const updated = await changeReportType(id, status);
        set({
            reports: get().reports.map((r) => (r.id === id ? updated : r)),
        });
    },

    deleteReport: async (id) => {
        await deleteReport(id);
        set({ reports: get().reports.filter((r) => r.id !== id) });
    },
}));

export default useReportStore;
