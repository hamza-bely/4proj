import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchReportsByUser } from "../../services/service/report-service.tsx";
import Spinner from "../../components/sniper/sniper.tsx";
import { useNavigate } from 'react-router-dom';
import {Report} from '../../services/model/report.tsx'


export default function ReportsUser() {
    const { t } = useTranslation();
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            setLoading(true);
            const response = await fetchReportsByUser();
            setReports(response.data);
        } catch (error) {
            console.error('Failed to load reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewOnMap = (latitude: number, longitude: number) => {
        navigate(`/map?lat=${latitude}&lng=${longitude}`);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const getReportTypeLabel = (type: string) => {
        const typeMappings = {
            ACCIDENTS: t('reportTypes.accidents'),
            TRAFFIC: t('reportTypes.traffic'),
            ROADS_CLOSED: t('reportTypes.roadsClosed'),
            POLICE_CHECKS: t('reportTypes.policeChecks'),
            OBSTACLES: t('reportTypes.obstacles')
        };
        return typeMappings[type as keyof typeof typeMappings] || type;
    };

    const getStatusLabel = (status: string) => {
        const statusMappings = {
            PENDING: t('reportStatus.pending'),
            CANCELED: t('reportStatus.canceled'),
            APPROVED: t('reportStatus.approved'),
            REJECTED: t('reportStatus.rejected')
        };
        return statusMappings[status as keyof typeof statusMappings] || status;
    };

    if (loading) {
        return (
            <div className="bg-white p-6 sm:rounded-lg">
                <Spinner/>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 sm:rounded-lg">
            <h2 className="text-xl font-semibold mb-4">{t('reports.myReports')}</h2>

            {reports.length === 0 ? (
                <p className="text-gray-500">{t('reports.noReports')}</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('reports.type')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('reports.status')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('reports.date')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('reports.location')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('common.actions')}
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {reports
                            .filter((report) => report.status !== "CANCELED")
                            .map((report) => (
                            <tr key={report.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {getReportTypeLabel(report.type)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                            report.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                report.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                    }`}>
                                        {getStatusLabel(report.status)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(report.createDate)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {report.address ?
                                        <div>
                                            {report.address}
                                        </div>
                                        :
                                        <div>
                                            {report.latitude.toFixed(6)}  {report.longitude.toFixed(6)}
                                        </div>

                                    }
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        className="text-indigo-600 hover:text-indigo-900 flex items-center"
                                        onClick={() => handleViewOnMap(report.latitude, report.longitude)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                        </svg>
                                        {t('reports.view-on-map')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}