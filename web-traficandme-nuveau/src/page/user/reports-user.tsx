import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchReportsByUser } from "../../services/service/report-service.tsx";
import Spinner from "../../components/sniper/sniper.tsx";
import { useNavigate } from 'react-router-dom';
import { Report } from '../../services/model/report.tsx';
import { LuMap } from "react-icons/lu";

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

    const ReportCard = ({ report }: { report: Report }) => (
        <div className="bg-white shadow rounded-lg mb-4 p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-3">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {getReportTypeLabel(report.type)}
                </span>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        report.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            report.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                }`}>
                    {getStatusLabel(report.status)}
                </span>
            </div>

            <div className="mb-3 text-sm text-gray-600">
                {formatDate(report.createDate)}
            </div>

            <div className="mb-3">
                <div className="text-xs font-medium text-gray-500 uppercase mb-1">{t('reports.location')}</div>
                <div className="text-sm text-gray-700">
                    {report.address || `${report.latitude.toFixed(6)} ${report.longitude.toFixed(6)}`}
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    className="text-indigo-600 hover:text-indigo-900 flex items-center text-sm"
                    onClick={() => handleViewOnMap(report.latitude, report.longitude)}
                >
                    <LuMap className="h-4 w-4 mr-1"/>
                    {t('reports.view-on-map')}
                </button>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="bg-white p-4 sm:p-6 sm:rounded-lg">
                <Spinner/>
            </div>
        );
    }

    const filteredReports = reports.filter((report) => report.status !== "CANCELED");

    return (
        <div className="bg-white p-4 sm:p-6 sm:rounded-lg">
            <h2 className="text-xl font-semibold mb-4">{t('reports.myReports')}</h2>

            {filteredReports.length === 0 ? (
                <p className="text-gray-500">{t('reports.noReports')}</p>
            ) : (
                <>
                    <div className="md:hidden">
                        {filteredReports.map((report) => (
                            <ReportCard key={report.id} report={report} />
                        ))}
                    </div>

                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('reports.type')}
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('reports.status')}
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('reports.date')}
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('reports.location')}
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('common.actions')}
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredReports.map((report) => (
                                <tr key={report.id}>
                                    <td className="px-3 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {getReportTypeLabel(report.type)}
                                            </span>
                                    </td>
                                    <td className="px-3 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                    report.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                        report.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                            }`}>
                                                {getStatusLabel(report.status)}
                                            </span>
                                    </td>
                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(report.createDate)}
                                    </td>
                                    <td className="px-3 py-4 text-sm text-gray-500 break-words">
                                        {report.address ?
                                            <div>
                                                {report.address}
                                            </div>
                                            :
                                            <div>
                                                {report.latitude.toFixed(6)} {report.longitude.toFixed(6)}
                                            </div>
                                        }
                                    </td>
                                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            className="text-indigo-600 hover:text-indigo-900 flex items-center"
                                            onClick={() => handleViewOnMap(report.latitude, report.longitude)}
                                        >
                                            <LuMap className="h-5 w-5 mr-1"/>
                                            {t('reports.view-on-map')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}