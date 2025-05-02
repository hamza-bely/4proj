import { ReportType, ReportStatus } from '@core/types';

export default interface ReportData  {
    type: ReportType;
    latitude: number;
    longitude: number;
    status: ReportStatus;
    address: string;
}