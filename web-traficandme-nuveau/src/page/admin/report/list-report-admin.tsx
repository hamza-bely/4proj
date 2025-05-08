import { useTranslation } from "react-i18next";
import useReportStore from "../../../services/store/report-store";
import { useEffect, useState } from "react";
import Spinner from "../../../components/sniper/sniper.tsx";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { LuMap, LuTrash2 } from "react-icons/lu";

export default function ListReportAdmin() {
    const { t } = useTranslation();
    const { reports, fetchReports, changeReportStatus, deleteReport } = useReportStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchReports();
                setIsLoading(false);
            } catch (error) {
                console.error("Erreur lors du chargement des rapports:", error);
            }
        };
        fetchData();
    }, [fetchReports]);

    const handleViewOnMap = (latitude: number, longitude: number) => {
        navigate(`/map?lat=${latitude}&lng=${longitude}`);
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteReport(id);
        } catch (error) {
            console.error("Erreur lors de la suppression du rapport", error);
        }
    };

    const handleStatusChange = (reportId: number, newStatus: string) => {
        changeReportStatus(reportId, newStatus);
    };

    const filteredReports = reports.filter((report) => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
            report.id.toString().includes(searchTermLower) ||
            (report.type && report.type.toLowerCase().includes(searchTermLower)) ||
            (report.user && report.user.toLowerCase().includes(searchTermLower)) ||
            (report.status && report.status.toLowerCase().includes(searchTermLower))
        );
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };


    const ReportCard = ({ report }: { report: any }) => (
        <div className="bg-white shadow rounded-lg mb-4 p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-900">ID: {report.id}</span>
                <span className="text-sm text-gray-500">
                    {report.type}
                </span>
            </div>

            <div className="mb-3">
                <div className="text-xs font-medium text-gray-500 uppercase mb-1">{t("report-admin.author")}</div>
                <div className="text-sm">{report.user}</div>
            </div>

            <div className="mb-3">
                <div className="text-xs font-medium text-gray-500 uppercase mb-1">{t("report-admin.status")}</div>
                <select
                    value={report.status}
                    onChange={(e) => handleStatusChange(report.id, e.target.value)}
                    className="w-full rounded border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                    <option value="AVAILABLE">{t("report-admin.status-available")}</option>
                    <option value="PENDING">{t("report-admin.status-pending")}</option>
                    <option value="CANCELED">{t("report-admin.status-canceled")}</option>
                </select>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                    <div className="text-xs font-medium text-gray-500 uppercase mb-1">{t("report-admin.likes")}</div>
                    <div className="text-sm">{report.likeCount}</div>
                </div>
                <div>
                    <div className="text-xs font-medium text-gray-500 uppercase mb-1">{t("report-admin.dislikes")}</div>
                    <div className="text-sm">{report.dislikeCount}</div>
                </div>
            </div>

            <div className="mb-4">
                <div className="text-xs font-medium text-gray-500 uppercase mb-1">{t("report-admin.createDate")}</div>
                <div className="text-sm text-gray-500">{formatDate(report.createDate)}</div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                    onClick={() => handleViewOnMap(report.latitude, report.longitude)}
                    className="text-indigo-600 hover:text-indigo-900 flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md"
                >
                    <LuMap className="h-4 w-4 mr-1"/>
                    {t("reports.view-on-map")}
                </button>

                <button
                    onClick={() => handleDelete(report.id)}
                    className="cursor-pointer rounded-md bg-red-700 px-4 py-2 text-white text-sm flex items-center justify-center"
                >
                    <LuTrash2 className="h-4 w-4 mr-1"/>
                    {t("common.delete-definitive")}
                </button>
            </div>
        </div>
    );

    return (
        <div className="px-4 sm:px-6 lg:px-8 mt-8 sm:mt-20">
            <ToastContainer
                style={{ zIndex: 9999 }}
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-lg sm:text-xl font-semibold text-gray-900">{t("report-admin.title")}</h1>
                </div>
            </div>

            <div className="mt-4 mb-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input
                        type="search"
                        id="search-reports"
                        className="block w-full sm:w-80 p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t("common.search")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="mt-8 flow-root">
                    <Spinner />
                </div>
            ) : filteredReports.length === 0 ? (
                <div className="py-4 text-center text-sm text-gray-500">
                    {searchTerm ? t("report-admin.no_results") : t("report-admin.no_reports")}
                </div>
            ) : (
                <>

                    <div className="lg:hidden mt-4">
                        {filteredReports.map((report) => (
                            <ReportCard key={report.id} report={report} />
                        ))}
                    </div>


                    <div className="hidden lg:block mt-8 flow-root">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead>
                                    <tr>
                                        <th scope="col" className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                                            {t("id")}
                                        </th>
                                        <th scope="col" className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                                            {t("report-admin.title")}
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            {t("report-admin.author")}
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            {t("report-admin.status")}
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            {t("report-admin.likes")}
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            {t("report-admin.dislikes")}
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            {t("report-admin.createDate")}
                                        </th>
                                        <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-3">
                                            <span className="sr-only">{t("report-admin.actions")}</span>
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                    {filteredReports.map((report) => (
                                        <tr key={report.id} className="even:bg-gray-50">
                                            <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-3">
                                                {report.id}
                                            </td>
                                            <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-3">
                                                {report.type}
                                            </td>
                                            <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                                                {report.user}
                                            </td>
                                            <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                                                <select
                                                    value={report.status}
                                                    onChange={(e) => handleStatusChange(report.id, e.target.value)}
                                                    className="rounded border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                >
                                                    <option value="AVAILABLE">{t("report-admin.status-available")}</option>
                                                    <option value="PENDING">{t("report-admin.status-pending")}</option>
                                                    <option value="CANCELED">{t("report-admin.status-canceled")}</option>
                                                </select>
                                            </td>
                                            <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                                                {report.likeCount}
                                            </td>
                                            <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                                                {report.dislikeCount}
                                            </td>
                                            <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                                                {formatDate(report.createDate)}
                                            </td>
                                            <td className="py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-3">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleViewOnMap(report.latitude, report.longitude)}
                                                        className="text-indigo-600 hover:text-indigo-900 flex items-center"
                                                    >
                                                        <LuMap className="h-5 w-5 mr-1"/>
                                                        <span className="hidden sm:inline">{t("reports.view-on-map")}</span>
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(report.id)}
                                                        className="cursor-pointer rounded-md bg-red-700 px-2 py-1 sm:px-4 sm:py-2 text-white text-sm flex items-center"
                                                    >
                                                        <LuTrash2 className="h-4 w-4 sm:mr-1"/>
                                                        <span className="hidden sm:inline">{t("common.delete-definitive")}</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}