import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { Report } from "../../../../services/model/report.tsx";
import useReportStore from "../../../../services/store/report-store.tsx";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {getUserRole} from "../../../../services/service/token-service.tsx";

const PopupContent = ({ info }: { info: Report }) => {
    const { t } = useTranslation();
    const { likeReport, dislikeReport, fetchReports,deleteReport, changeReportStatus} = useReportStore();
    const [role, setRole] = useState<string | string[] | null>(null);
    const [showStatusOptions, setShowStatusOptions] = useState(false);

    useEffect(() => {
        setRole(getUserRole());
    }, []);

    const handleOnLike = async () => {
        try {
            await likeReport(info.id);
        } catch (error) {
            console.error("Erreur lors du like du rapport", error);
        }
    };

    const handleOnDislike = async () => {
        try {
            await dislikeReport(info.id);
        } catch (error) {
            console.error("Erreur lors du dislike du rapport", error);
        }
    };

    const handleStatusChange = async (status: string) => {
        try {
            await changeReportStatus(info.id, status);
            setShowStatusOptions(false);
            fetchReports();
        } catch (error) {
            console.error("Erreur lors du changement de statut", error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteReport(info.id);
            fetchReports();
            close();
        } catch (error) {
            console.error("Erreur lors de la suppression du rapport", error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const getStatusLabel = (status: string) => {
        const statusMappings: Record<string, string> = {
            PENDING: t('reportStatus.pending'),
            CANCELED: t('reportStatus.canceled'),
            AVAILABLE: t('reportStatus.available'),
            UNAVAILABLE: t('reportStatus.unavailable')
        };
        return statusMappings[status] || status;
    };

    const getTypeLabel = (type: string) => {
        const typeMappings: Record<string, string> = {
            ACCIDENTS: t('reportTypes.accidents'),
            TRAFFIC: t('reportTypes.traffic'),
            ROADS_CLOSED: t('reportTypes.roadsClosed'),
            POLICE_CHECKS: t('reportTypes.policeChecks'),
            OBSTACLES: t('reportTypes.obstacles')
        };
        return typeMappings[type] || type;
    };

    const isAdmin = role === "ROLE_ADMIN";

    return (
        <div className="p-4 text-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">{t('reports.signalDetails')}</h2>

            <div className="flex items-center space-x-3 mb-2">
                <h3 className="font-semibold text-lg">{getTypeLabel(info.type)}</h3>
            </div>
            <fieldset className="border-t border-b border-gray-200 py-2">
                <div className="divide-y divide-gray-200">
                    <div className="relative flex flex-col gap-2 pb-2">
                        <label className="font-medium text-gray-900">{t('reports.createdBy')} :</label>
                        <p className="text-gray-700 text-sm">{info.user}</p>
                    </div>
                    <div className="relative flex flex-col gap-2 pb-2">
                        <label className="font-medium text-gray-900">{t('reports.createdAt')} :</label>
                        <p className="text-gray-700 text-sm">{formatDate(info.createDate)}</p>
                    </div>
                    <div className="relative flex flex-col gap-2 pb-2">
                        <label className="font-medium text-gray-900">{t('reports.status')} :</label>
                        <div className="flex items-center">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                info.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                    info.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                        info.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                            }`}>
                                {getStatusLabel(info.status)}
                            </span>

                            {isAdmin && info.status !== 'CANCELED' && (
                                <button
                                    onClick={() => setShowStatusOptions(!showStatusOptions)}
                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                >
                                    <MdEdit size={18} />
                                </button>
                            )}
                        </div>

                        {showStatusOptions && isAdmin && (
                            <div className="mt-2 flex flex-col space-y-2 bg-gray-50 p-2 rounded-md">
                                <button
                                    onClick={() => handleStatusChange('AVAILABLE')}
                                    className="text-left px-2 py-1 text-sm hover:bg-green-100 rounded"
                                >
                                    {t('reportStatus.available')}
                                </button>
                                <button
                                    onClick={() => handleStatusChange('UNAVAILABLE')}
                                    className="text-left px-2 py-1 text-sm hover:bg-red-100 rounded"
                                >
                                    {t('reportStatus.unavailable')}
                                </button>

                                <button
                                    onClick={() => handleStatusChange('PENDING')}
                                    className="text-left px-2 py-1 text-sm hover:bg-yellow-100 rounded"
                                >
                                    {t('reportStatus.pending')}
                                </button>
                                <button
                                    onClick={() => handleStatusChange('CANCELED')}
                                    className="text-left px-2 py-1 text-sm hover:bg-yellow-100 rounded"
                                >
                                    {t('reportStatus.canceled')}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="relative flex justify-between items-center pt-2">
                        <span className="font-medium text-gray-900">{t('reports.votes')} :</span>
                        <div className="flex space-x-4">
                            <button
                                onClick={handleOnLike}
                                className={`flex items-center space-x-1 ${info.likeCount ? 'bg-green-600' : 'bg-green-500'} text-white px-2 py-1 rounded-md shadow-md hover:bg-green-600 transition`}
                            >
                                <AiFillLike /> <span>{info.likeCount}</span>
                            </button>
                            <button
                                onClick={handleOnDislike}
                                className={`flex items-center space-x-1 ${info.dislikeCount ? 'bg-red-600' : 'bg-red-500'} text-white px-2 py-1 rounded-md shadow-md hover:bg-red-600 transition`}
                            >
                                <AiFillDislike /> <span>{info.dislikeCount}</span>
                            </button>
                        </div>
                    </div>

                    {isAdmin && (
                        <div className="pt-4">
                            <button
                                onClick={handleDelete}
                                className="w-full flex items-center justify-center space-x-2 bg-red-500 text-white px-3 py-2 rounded-md shadow-md hover:bg-red-600 transition"
                            >
                                <FaTrash /> <span>{t('common.delete')}</span>
                            </button>
                        </div>
                    )}
                </div>
            </fieldset>
        </div>
    );
};

export default PopupContent;