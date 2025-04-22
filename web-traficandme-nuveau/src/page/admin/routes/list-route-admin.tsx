import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Spinner from "../../../components/sniper/sniper.tsx";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import useRouteStore from "../../../services/store/route-store.tsx";
import {SavedRoute} from "../../user/routes-user.tsx";

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

    const filteredRoutes = routes.filter((route) => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
            route.id.toString().includes(searchTermLower) ||
            (route.mode && route.mode.toLowerCase().includes(searchTermLower)) ||
            (route.user && route.user.toLowerCase().includes(searchTermLower)) ||
            (route.status && route.status.toLowerCase().includes(searchTermLower)) ||
            (route.address_start && route.address_start.toLowerCase().includes(searchTermLower)) ||
            (route.address_end && route.address_end.toLowerCase().includes(searchTermLower))
        );
    });

    return (
        <div className="px-4 sm:px-6 lg:px-8 mt-20">
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
                    <h1 className="text-base font-semibold text-gray-900">{t("route-admin.title", "Liste des itinéraires")}</h1>
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
                        className="block w-80 p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t("common.search", "Rechercher")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                            <tr>
                                <th scope="col"
                                    className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                                    {t("id", "ID")}
                                </th>
                                <th scope="col"
                                    className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-3">
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
                                        <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-3">
                                            {route.id}
                                        </td>
                                        <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-3">
                                            {route.mode}
                                        </td>
                                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                                            {route.user}
                                        </td>
                                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                                           {route.status}
                                        </td>
                                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                                            {route.peage ? t("common.yes", "Oui") : t("common.no", "Non")}
                                        </td>
                                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                                            {route.address_start || `${route.startLatitude}, ${route.startLongitude}`}
                                        </td>
                                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                                            {route.address_end || `${route.endLatitude}, ${route.endLongitude}`}
                                        </td>
                                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                                            {new Date(route.createDate).toLocaleString()}
                                        </td>
                                        <td className="relative flex py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-3">
                                            <button
                                                onClick={() => handleViewRouteOnMap(route)}
                                                className="text-indigo-600 hover:text-indigo-900 flex items-center justify-center"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1"
                                                     fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                                                </svg>
                                                {t("routes.view-on-map", "Voir sur la carte")}
                                            </button>

                                            <button
                                                onClick={() => handleDelete(route.id)}
                                                className="cursor-pointer ml-2 rounded-lg block bg-red-600 px-4 py-2 text-left text-white text-sm"
                                            >
                                                {t("common.delete-definitive", "Supprimer")}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}