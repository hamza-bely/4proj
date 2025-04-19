import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Routes from "../../../routes/routes.tsx";
import { fetchSumOfMapStatistic } from '../../../services/service/admin-serivce.tsx';
import { AdminSumStats } from '../../../services/model/user.tsx';

// Types pour les données
interface ApiUsageData {
    date: string;
    routeSearches: number;
    geocoding: number;
    trafficInfo: number;
}

interface RouteData {
    type: string;
    count: number;
}

interface ApiErrorData {
    errorType: string;
    count: number;
}

interface MapUsageData {
    date: string;
    routeSearches: number;
    geocoding: number;
    trafficInfo: number;
}
// Composant principal
const TomTomApiDashboard: React.FC = () => {
    // États pour stocker les données
    const [usageData, setUsageData] = useState<ApiUsageData[]>([]);
    const [routeData, setRouteData] = useState<RouteData[]>([]);
    const [errorData, setErrorData] = useState<ApiErrorData[]>([]);
    const [mapData, setMapData] = useState<AdminSumStats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [timeRange, setTimeRange] = useState<string>('week');

    // Couleurs pour les graphiques
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    // Données fictives pour la démonstration
    useEffect(() => {
        // Simuler un chargement de données
        setTimeout(() => {
            // Données d'utilisation quotidienne
            const mockUsageData: ApiUsageData[] = [
                { date: '2025-04-01', routeSearches: 320, geocoding: 150, trafficInfo: 90 },
                { date: '2025-04-02', routeSearches: 350, geocoding: 130, trafficInfo: 85 },
                { date: '2025-04-03', routeSearches: 410, geocoding: 145, trafficInfo: 100 },
                { date: '2025-04-04', routeSearches: 490, geocoding: 160, trafficInfo: 110 },
                { date: '2025-04-05', routeSearches: 380, geocoding: 170, trafficInfo: 95 },
                { date: '2025-04-06', routeSearches: 360, geocoding: 150, trafficInfo: 88 },
            ];

            // Types de recherches d'itinéraires
            const mockRouteData: RouteData[] = [
                { type: 'Le plus rapide', count: 1250 },
                { type: 'Le plus court', count: 850 },
                { type: 'Économique', count: 650 },
                { type: 'Touristique', count: 320 },
                { type: 'Sans péage', count: 580 },
            ];

            // Données d'erreurs
            const mockErrorData: ApiErrorData[] = [
                { errorType: 'Timeout', count: 45 },
                { errorType: 'Adresse non trouvée', count: 78 },
                { errorType: 'Quota dépassé', count: 12 },
                { errorType: 'Paramètres invalides', count: 35 },
                { errorType: 'Autres', count: 20 },
            ];

            setUsageData(mockUsageData);
            setRouteData(mockRouteData);
            setErrorData(mockErrorData);
            setLoading(false);
        }, 1000);
    }, [timeRange]);

    // je fetch les totaux de la maps
    useEffect(() => {
        fetchSumOfMapStatistic()
          .then(setMapData)
          .catch(err => console.error("Erreur stats map", err));
      }, []);


    // Gestionnaire de changement de plage de temps
    const handleTimeRangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTimeRange(event.target.value);
        setLoading(true);
    };

    // Calcul des statistiques totales
    const totalRouteSearches = usageData.reduce((sum, item) => sum + item.routeSearches, 0);
    const totalGeocoding = usageData.reduce((sum, item) => sum + item.geocoding, 0);
    const totalTrafficInfo = usageData.reduce((sum, item) => sum + item.trafficInfo, 0);
    const totalErrors = errorData.reduce((sum, item) => sum + item.count, 0);

    if (loading) {
        return <div className="flex justify-center items-center h-64">Chargement des données...</div>;
    }

    return (
        <div className="p-4 bg-gray-50 rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Tableau de Bord API TomTom</h1>

            {/* Filtres et contrôles */}
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <label htmlFor="timeRange" className="mr-2 font-medium">Période :</label>
                    <select
                        id="timeRange"
                        className="p-2 border rounded"
                        value={timeRange}
                        onChange={handleTimeRangeChange}
                    >
                        <option value="day">Aujourd'hui</option>
                        <option value="week">Cette semaine</option>
                        <option value="month">Ce mois</option>
                        <option value="quarter">Ce trimestre</option>
                    </select>
                </div>
                <div className="text-sm text-gray-500">
                    Dernière mise à jour: {new Date().toLocaleString()}
                </div>
            </div>

            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Nombres d'utilisateurs</h3>
                    <p className="text-2xl font-bold">{mapData?.data.userTotal}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Recherches d'itinéraires</h3>
                    <p className="text-2xl font-bold">{mapData?.data.routeSearches}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Info Trafic</h3>
                    <p className="text-2xl font-bold">{mapData?.data.trafficInfo}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Erreurs</h3>
                    <p className="text-2xl font-bold text-red-500">{totalErrors}</p>
                </div>
            </div>

            {/* Graphiques */}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/*

           ** a discuter  Graphique d'utilisation quotidienne **

                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Utilisation Quotidienne</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={usageData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="routeSearches" stroke="#0088FE" name="Recherches d'itinéraires" />
                            <Line type="monotone" dataKey="geocoding" stroke="#00C49F" name="Géocodage" />
                            <Line type="monotone" dataKey="trafficInfo" stroke="#FFBB28" name="Info Trafic" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            */}
                {/* Graphique des types de recherches d'itinéraires */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Types de signalement sur l'Itinéraires</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={routeData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ type, percent }) => `${type}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="count"
                            >
                                {routeData.map((type , index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>


                {/* Graphique des types de recherches d'itinéraires */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Types de Recherches d'Itinéraires</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={routeData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ type, percent }) => `${type}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="count"
                            >
                                {routeData.map((type , index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Graphique des erreurs API */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Types d'Erreurs API</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={errorData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="errorType" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#FF8042" name="Nombre d'erreurs" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Tableau récapitulatif */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Résumé des Performances</h2>
                    <table className="min-w-full">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="text-left p-2">Métrique</th>
                            <th className="text-left p-2">Valeur</th>
                            <th className="text-left p-2">Performance</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr className="border-b">
                            <td className="p-2">Taux de réussite</td>
                            <td className="p-2">{((totalRouteSearches + totalGeocoding + totalTrafficInfo - totalErrors) / (totalRouteSearches + totalGeocoding + totalTrafficInfo) * 100).toFixed(2)}%</td>
                            <td className="p-2 text-green-500">Bon</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-2">Temps de réponse moyen</td>
                            <td className="p-2">320ms</td>
                            <td className="p-2 text-green-500">Excellent</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-2">Utilisation du quota</td>
                            <td className="p-2">68%</td>
                            <td className="p-2 text-yellow-500">Modéré</td>
                        </tr>
                        <tr>
                            <td className="p-2">Coût par requête</td>
                            <td className="p-2">0.0023€</td>
                            <td className="p-2 text-green-500">Bon</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TomTomApiDashboard;