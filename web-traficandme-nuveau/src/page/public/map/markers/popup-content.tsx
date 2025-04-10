import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { Report } from "../../../../services/model/report.tsx";
import useReportStore from "../../../../services/store/report-store.tsx";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getUserRole } from "../../../../services/service/token-service.tsx";
import useUserStore from "../../../../services/store/user-store.tsx";

const PopupContent = ({ info: initialInfo, onClose }: { info: Report, onClose?: () => void }) => {
    const { t } = useTranslation();
    const { likeReport, dislikeReport, deleteReport, changeReportStatus } = useReportStore();
    const { user } = useUserStore();
    const [role, setRole] = useState<string | string[] | null>(null);
    const [currentUsername, setCurrentUsername] = useState<string | undefined>(null);
    const [showStatusOptions, setShowStatusOptions] = useState(false);

    const [reportInfo, setReportInfo] = useState<Report>(initialInfo);
    const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null);

    useEffect(() => {
        setRole(getUserRole());
        setCurrentUsername(user?.email);
    }, [user]);

    const handleOnLike = async () => {
        try {
            const response = await likeReport(reportInfo.id);

            if (response && response) {
                setReportInfo(response);

                if (reportInfo.likeCount < response.likeCount) {
                    setUserVote('like');
                } else if (reportInfo.likeCount > response.likeCount) {
                    setUserVote(null);
                }
            }
        } catch (error) {
            console.error("Erreur lors du like du rapport", error);
        }
    };

    const handleOnDislike = async () => {
        try {
            const response = await dislikeReport(reportInfo.id);
            if (response && response) {
                setReportInfo(response);

                if (reportInfo.dislikeCount < response.dislikeCount) {
                    setUserVote('dislike');
                } else if (reportInfo.dislikeCount > response.dislikeCount) {
                    setUserVote(null);
                }
            }
        } catch (error) {
            console.error("Erreur lors du dislike du rapport", error);
        }
    };

    const handleStatusChange = async (status: string) => {
        try {
            const response = await changeReportStatus(reportInfo.id, status);
            setShowStatusOptions(false);

            if (response && response) {
                setReportInfo(response);
            }
        } catch (error) {
            console.error("Erreur lors du changement de statut", error);
        }
    };

    const handleDelete = async () => {
        try {
            if (isAdmin) {
                await deleteReport(reportInfo.id);
            } else {
                const response = await changeReportStatus(reportInfo.id, "CANCELED");
                if (response && response) {
                    setReportInfo(response);
                }
            }

            if (onClose) {
                onClose();
            } else if (typeof close === 'function') {
                close();
            }

            window.location.reload();

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
    const isOwner = currentUsername === reportInfo.user;
    const canEdit = isAdmin || isOwner;
    const canDelete = isAdmin || isOwner;

    return (
        <div className="p-4 text-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">{t('reports.signalDetails')}</h2>

            <div className="flex items-center space-x-3 mb-2">
                <h3 className="font-semibold text-lg">{getTypeLabel(reportInfo.type)}</h3>
            </div>
            <fieldset className="border-t border-b border-gray-200 py-2">
                <div className="divide-y divide-gray-200">
                    <div className="relative flex flex-col gap-2 pb-2">
                        <label className="font-medium text-gray-900">{t('reports.createdBy')} :</label>
                        <p className="text-gray-700 text-sm">{reportInfo.user}</p>
                    </div>
                    <div className="relative flex flex-col gap-2 pb-2">
                        <label className="font-medium text-gray-900">{t('reports.createdAt')} :</label>
                        <p className="text-gray-700 text-sm">{formatDate(reportInfo.createDate)}</p>
                    </div>
                    <div className="relative flex flex-col gap-2 pb-2">
                        <label className="font-medium text-gray-900">{t('reports.status')} :</label>
                        <div className="flex items-center">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                reportInfo.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                    reportInfo.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                                        reportInfo.status === 'CANCELED' ? 'bg-gray-100 text-gray-800' :
                                            'bg-gray-100 text-gray-800'
                            }`}>
                                {getStatusLabel(reportInfo.status)}
                            </span>

                            {canEdit && reportInfo.status !== 'CANCELED' && (
                                <button
                                    onClick={() => setShowStatusOptions(!showStatusOptions)}
                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                >
                                    <MdEdit size={18} />
                                </button>
                            )}
                        </div>

                        {showStatusOptions && canEdit && (
                            <div className="mt-2 flex flex-col space-y-2 bg-gray-50 p-2 rounded-md">
                                <button
                                    onClick={() => handleStatusChange('AVAILABLE')}
                                    className="text-left px-2 py-1 text-sm hover:bg-green-100 rounded"
                                >
                                    {t('reportStatus.available')}
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
                    {role && <div className="relative flex justify-between items-center pt-2">
                        <span className="font-medium text-gray-900">{t('reports.votes')} :</span>
                        <div className="flex space-x-4">
                            <button
                                onClick={handleOnLike}
                                className={`flex items-center space-x-1 ${
                                    userVote === 'like' ? 'bg-green-600' : 'bg-green-500'
                                } text-white px-2 py-1 rounded-md shadow-md hover:bg-green-600 transition`}
                            >
                                <AiFillLike /> <span>{reportInfo.likeCount}</span>
                            </button>
                            <button
                                onClick={handleOnDislike}
                                className={`flex items-center space-x-1 ${
                                    userVote === 'dislike' ? 'bg-red-600' : 'bg-red-500'
                                } text-white px-2 py-1 rounded-md shadow-md hover:bg-red-600 transition`}
                            >
                                <AiFillDislike /> <span>{reportInfo.dislikeCount}</span>
                            </button>
                        </div>
                    </div>}

                    {canDelete && (
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