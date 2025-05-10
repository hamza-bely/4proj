import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Spinner from "../../../components/sniper/sniper.tsx";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import useRouteStore from "../../../services/store/route-store.tsx";
import { SavedRoute } from "../../user/itinerary-user.tsx";

export default function ListRouteAdmin() {
    const { t } = useTranslation();
    const { routes, fetchRoutes, deleteDefinitiveRouteFoAnAdmin } = useRouteStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchRoutes();
                setIsLoading(false);
            } catch (error) {
                console.error("Erreur lors du chargement des routes:", error);
            }
        };
        fetchData();
    }, [fetchRoutes]);

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

        navigate(`/map?${params}`);
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteDefinitiveRouteFoAnAdmin(id);
        } catch (error) {
            console.error("Erreur lors de la suppression de la route", error);
        }
    };
    function getStatusInfo(status: string): { label: string; color: string; icon: string } {
        switch (status) {
          case 'TRAFFIC_LIKELY':
            return { label: 'Trafic trouvé', color: 'bg-red-600', icon: '🚦' };
          case 'TRAFFIC_POSSIBLE':
            return { label: 'Trafic possible', color: 'bg-yellow-500', icon: '⚠️' };
          case 'TRAFFIC_NONE':
            return { label: 'Trafic fluide', color: 'bg-green-600', icon: '✅' };
          default:
            return { label: 'Statut inconnu', color: 'bg-gray-500', icon: '❓' };
        }
      }
      
    const filteredRoutes = routes.filter((route) => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
            (route.mode && route.mode.toLowerCase().includes(searchTermLower)) ||
            (route.user && route.user.toLowerCase().includes(searchTermLower)) ||
            (route.status && route.status.toLowerCase().includes(searchTermLower)) ||
            (route.address_start && route.address_start.toLowerCase().includes(searchTermLower)) ||
            (route.address_end && route.address_end.toLowerCase().includes(searchTermLower))
        );
    });

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-4 mt-16 sm:mt-20 max-w-full">
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
                    <h1 className="text-xl font-semibold text-gray-900">{t("route-admin.title", "Liste des itinéraires")}</h1>
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
                        id="search-routes"
                        className="block w-full sm:w-80 p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t("common.search", "Rechercher")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>


            <div className="mt-4 hidden md:block overflow-x-auto">
                <div className="inline-block min-w-full py-2 align-middle">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                        <tr>
                            <th scope="col" className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                                {t("id", "ID")}
                            </th>
                            <th scope="col" className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                                {t("route-admin.mode", "Mode")}
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                {t("route-admin.user", "Utilisateur")}
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                {t("route-admin.status", "Statut")}
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                {t("route-admin.peage", "Péage")}
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                {t("route-admin.address_start", "Départ")}
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                {t("route-admin.address_end", "Arrivée")}
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                {t("route-admin.itineraryStatus", "Etat")}
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                {t("route-admin.createDate", "Date de création")}
                            </th>
                            <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-3">
                                <span className="sr-only">{t("route-admin.actions", "Actions")}</span>
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white">
                        {isLoading ? (
                            <tr>
                                <td colSpan={9} className="py-4 text-center text-sm text-gray-500">
                                    <Spinner />
                                </td>
                            </tr>
                        ) : filteredRoutes.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="py-4 text-center text-sm text-gray-500">
                                    {searchTerm ? t("route-admin.no_results", "Aucun résultat trouvé") : t("route-admin.no_routes", "Aucun itinéraire disponible")}
                                </td>
                            </tr>
                        ) : (
                            filteredRoutes.map((route) => (
                                <tr key={route.id} className="even:bg-gray-50">
                                    <td className="py-4 pr-3 pl-4 text-sm font-medium text-gray-900 sm:pl-3">
                                        {route.id}
                                    </td>
                                    <td className="py-4 pr-3 pl-4 text-sm font-medium text-gray-900 sm:pl-3">
                                        {route.mode}
                                    </td>
                                    <td className="px-3 py-4 text-sm text-gray-500">
                                        {route.user}
                                    </td>
                                    <td className="px-3 py-4 text-sm text-gray-500">
                                        {route.status}
                                    </td>
                                    <td className="px-3 py-4 text-sm text-gray-500">
                                        {route.peage ? t("common.yes", "Oui") : t("common.no", "Non")}
                                    </td>
                                    <td className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">
                                        {route.address_start || `${route.startLatitude}, ${route.startLongitude}`}
                                    </td>
                                    <td className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">
                                        {route.address_end || `${route.endLatitude}, ${route.endLongitude}`}
                                    </td>
                                    <td className="px-3 py-4 text-sm">
                                    {route.itineraryStatus && (() => {
                                        const statusInfo = getStatusInfo(route.itineraryStatus);
                                        return (
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-white font-medium ${statusInfo.color}`}>
                                            <span className="mr-1">{statusInfo.icon}</span>
                                            {statusInfo.label}
                                        </span>
                                        );
                                    })()}
                                    </td>
                                    <td className="px-3 py-4 text-sm text-gray-500">
                                        {new Date(route.createDate).toLocaleString()}
                                    </td>
                                    <td className="py-4 pr-4 pl-3 text-right text-sm font-medium">
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <button
                                                onClick={() => handleViewRouteOnMap(route)}
                                                className="text-indigo-600 hover:text-indigo-900 flex items-center justify-center whitespace-nowrap"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1"
                                                     fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                                                </svg>
                                                {t("routes.view-on-map", "Voir")}
                                            </button>

                                            <button
                                                onClick={() => handleDelete(route.id)}
                                                className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-sm flex items-center justify-center"
                                            >
                                                {t("common.delete-definitive", "Supprimer")}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Card view for mobile screens */}
            <div className="mt-4 md:hidden">
                {isLoading ? (
                    <div className="flex justify-center p-4">
                        <Spinner />
                    </div>
                ) : filteredRoutes.length === 0 ? (
                    <div className="text-center p-4 text-sm text-gray-500">
                        {searchTerm ? t("route-admin.no_results", "Aucun résultat trouvé") : t("route-admin.no_routes", "Aucun itinéraire disponible")}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredRoutes.map((route) => (
                            <div key={route.id} className="bg-white border rounded-lg shadow-sm p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className="text-xs font-medium text-gray-500">ID: {route.id}</span>
                                        <h3 className="text-sm font-semibold">{route.mode}</h3>
                                    </div>
                                    <span className="text-xs text-gray-500">{new Date(route.createDate).toLocaleDateString()}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                                    <div>
                                        <p className="font-medium text-gray-500">{t("route-admin.user", "Utilisateur")}:</p>
                                        <p>{route.user}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-500">{t("route-admin.status", "Statut")}:</p>
                                        <p>{route.status}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-500">{t("route-admin.peage", "Péage")}:</p>
                                        <p>{route.peage ? t("common.yes", "Oui") : t("common.no", "Non")}</p>
                                    </div>
                                </div>

                                <div className="text-xs mb-3">
                                    <p className="font-medium text-gray-500 mb-1">{t("route-admin.address_start", "Départ")}:</p>
                                    <p className="truncate">{route.address_start || `${route.startLatitude}, ${route.startLongitude}`}</p>
                                </div>

                                <div className="text-xs mb-4">
                                    <p className="font-medium text-gray-500 mb-1">{t("route-admin.address_end", "Arrivée")}:</p>
                                    <p className="truncate">{route.address_end || `${route.endLatitude}, ${route.endLongitude}`}</p>
                                </div>

                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() => handleViewRouteOnMap(route)}
                                        className="flex-1 text-indigo-600 border border-indigo-600 hover:bg-indigo-50 rounded-lg py-2 text-sm flex items-center justify-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1"
                                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                                        </svg>
                                        {t("routes.view-on-map", "Voir sur la carte")}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(route.id)}
                                        className="flex-1 text-white bg-red-600 hover:bg-red-700 rounded-lg py-2 text-sm flex items-center justify-center"
                                    >
                                        {t("common.delete-definitive", "Supprimer")}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}