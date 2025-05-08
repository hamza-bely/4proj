import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Spinner from "../../components/sniper/sniper.tsx";
import { useNavigate } from 'react-router-dom';
import useRouteStore from "../../services/store/route-store.tsx";
import { LuTrash2, LuMap } from "react-icons/lu";

export interface SavedRoute {
    startLongitude: string;
    startLatitude: string;
    endLongitude: string;
    endLatitude: string;
    address_start: string;
    address_end: string;
    mode: string;
    user: string;
    createDate: string;
    updateDate: string;
    status: string;
    id: number;
    peage: boolean;
}

export default function ItineraryUser() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<number | null>(null);
    const navigate = useNavigate();
    const { routeUser, fetchRoutesByUser, deleteRouteForAnUser } = useRouteStore();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            await fetchRoutesByUser();
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewRouteOnMap = (route: SavedRoute) => {
        const params = new URLSearchParams({
            startLat: route.startLatitude,
            startLon: route.startLongitude,
            endLat: route.endLatitude,
            endLon: route.endLongitude,
            mode: route.mode,
            peage: route.peage.toString(),
            routeId: route.id.toString()
        });

        navigate(`/map?${params.toString()}`);
    };

    const handleDeleteRoute = async (routeId: number) => {
        console.log(routeId)
        if (window.confirm(t('routes.confirmDelete'))) {
            try {
                setDeleting(routeId);
                await deleteRouteForAnUser(routeId);

                await loadData();
            } catch (error) {
                console.error('Failed to delete route:', error);
            } finally {
                setDeleting(null);
            }
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const getStatusLabel = (status: string) => {
        const statusMappings = {
            CANCELED: t('status.canceled'),
            ACTIVE: t('status.active')
        };
        return statusMappings[status as keyof typeof statusMappings] || status;
    };

    const getModeLabel = (mode: string) => {
        const modeMappings = {
            'Rapide': t('route.mode.fastest'),
            'Court': t('route.mode.shortest')
        };
        return modeMappings[mode as keyof typeof modeMappings] || mode;
    };

    const RouteCard = ({ route }: { route: SavedRoute }) => (
        <div className="bg-white shadow rounded-lg mb-4 p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-2">
                <div className="flex space-x-2">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {getModeLabel(route.mode)}
                    </span>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        route.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                        {getStatusLabel(route.status)}
                    </span>
                </div>
                <div className="text-xs text-gray-500">
                    {formatDate(route.createDate)}
                </div>
            </div>

            <div className="mb-2">
                <div className="text-xs font-medium text-gray-500 uppercase">{t('routes.start')}</div>
                <div className="text-sm text-gray-700">
                    {route.address_start || `${route.startLatitude}, ${route.startLongitude}`}
                </div>
            </div>

            <div className="mb-3">
                <div className="text-xs font-medium text-gray-500 uppercase">{t('routes.end')}</div>
                <div className="text-sm text-gray-700">
                    {route.address_end || `${route.endLatitude}, ${route.endLongitude}`}
                </div>
            </div>

            <div className="text-xs text-gray-500 mb-3">
                {route.peage ? t('routes.withTolls') : t('routes.withoutTolls')}
            </div>

            <div className="flex justify-between">
                <button
                    className="text-indigo-600 hover:text-indigo-900 flex items-center text-sm"
                    onClick={() => handleViewRouteOnMap(route)}
                >
                    <LuMap className="h-4 w-4 mr-1"/>
                    {t('routes.viewOnMap')}
                </button>
                <button
                    className="text-red-600 hover:text-red-900 flex items-center text-sm"
                    onClick={() => handleDeleteRoute(route.id)}
                    disabled={deleting === route.id}
                >
                    <LuTrash2 className="h-4 w-4 mr-1"/>
                    {deleting === route.id ? t('routes.deleting') : t('routes.delete')}
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

    return (
        <div className="bg-white p-4 sm:p-6 sm:rounded-lg">
            <h2 className="text-xl font-semibold mb-4">{t('route.title')}</h2>
            {routeUser.length === 0 ? (
                <p className="text-gray-500">{t('routes.noRoutes')}</p>
            ) : (
                <>
                    <div className="md:hidden">
                        {routeUser.map((route) => (
                            <RouteCard key={route.id} route={route} />
                        ))}
                    </div>

                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 table-fixed">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="w-1/12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('routes.mode')}
                                </th>
                                <th className="w-1/12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('routes.peage')}
                                </th>
                                <th className="w-1/12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('routes.status')}
                                </th>
                                <th className="w-1/12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('routes.date')}
                                </th>
                                <th className="w-3/12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('routes.start')}
                                </th>
                                <th className="w-3/12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('routes.end')}
                                </th>
                                <th className="w-2/12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('common.actions')}
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {routeUser.map((route) => (
                                <tr key={route.id}>
                                    <td className="px-3 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {getModeLabel(route.mode)}
                                            </span>
                                    </td>
                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {route.peage ? t('routes.withTolls') : t('routes.withoutTolls')}
                                    </td>
                                    <td className="px-3 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                route.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {getStatusLabel(route.status)}
                                            </span>
                                    </td>
                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(route.createDate)}
                                    </td>
                                    <td className="px-3 py-4 text-sm text-gray-500 break-words">
                                        <div className="min-h-12">
                                            {route.address_start || `${route.startLatitude}, ${route.startLongitude}`}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4 text-sm text-gray-500 break-words">
                                        <div className="min-h-12">
                                            {route.address_end || `${route.endLatitude}, ${route.endLongitude}`}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4 text-sm font-medium">
                                        <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-2 lg:space-y-0">
                                            <button
                                                className="text-indigo-600 hover:text-indigo-900 flex items-center"
                                                onClick={() => handleViewRouteOnMap(route)}
                                            >
                                                <LuMap className="h-5 w-5 mr-1"/>
                                                {t('routes.viewOnMap')}
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-900 flex items-center"
                                                onClick={() => handleDeleteRoute(route.id)}
                                                disabled={deleting === route.id}
                                            >
                                                <LuTrash2 className="h-5 w-5 mr-1"/>
                                                {deleting === route.id ? t('routes.deleting') : t('routes.delete')}
                                            </button>
                                        </div>
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