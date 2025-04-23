import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart, Line
} from 'recharts';
import {
    fetchApiStatisticsPerTime,
    fetchReportsByTypeStatistics,
    fetchRoutesByModeStatistics,
    fetchSumOfMapStatistic
} from '../../../services/service/admin-serivce.tsx';
import { AdminSumStats } from '../../../services/model/user.tsx';

interface ApiUsageData {
    date: string;
    routeSearches: number;
    trafficInfo: number;
}

interface RouteData {
    type: string;
    count: number;
}

interface ReportData {
    mode: string;
    count: number;
}

interface ApiErrorData {
    errorType: string;
    count: number;
}

const Dashboard: React.FC = () => {
    const [reportData, setReportData] = useState<ReportData[]>([]);
    const [itineraryData, setItineraryData] = useState<RouteData[]>([]);
    const [usageData, setUsageData] = useState<ApiUsageData[]>([]);
    const [errorData, setErrorData] = useState<ApiErrorData[]>([]);
    const [mapData, setMapData] = useState<AdminSumStats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [timeRange, setTimeRange] = useState<string>('WEEK');

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    useEffect(() => {
        setTimeout(() => {
            const mockErrorData: ApiErrorData[] = [
                { errorType: 'Timeout', count: 45 },
                { errorType: 'Adresse non trouvée', count: 78 },
                { errorType: 'Quota dépassé', count: 12 },
                { errorType: 'Paramètres invalides', count: 35 },
                { errorType: 'Autres', count: 20 },
            ];

            setErrorData(mockErrorData);
            setLoading(false);
        }, 1000);
    }, [timeRange]);

    useEffect(() => {
        fetchSumOfMapStatistic()
          .then(setMapData)
          .catch(err => console.error("Erreur stats map", err));
      }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchReportsByTypeStatistics();
                setReportData(data.data)
                console.log("data",data); // Example: Log the data
            } catch (err) {
                console.error("Erreur stats map", err);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchRoutesByModeStatistics();
                setItineraryData(data.data)
                console.log("data",data); // Example: Log the data
            } catch (err) {
                console.error("Erreur stats map", err);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchApiStatisticsPerTime(timeRange);
                setUsageData(data.data)
                console.log("data",data); // Example: Log the data
            } catch (err) {
                console.error("Erreur stats map", err);
            }
        };
        if (timeRange) {
            fetchData();
        }
    }, [timeRange]);

    // Gestionnaire de changement de plage de temps fetchRoutesByStatisticsPerTime("WEEK")
    const handleTimeRangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTimeRange(event.target.value);
        setLoading(true);
    };

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
                        <option value="TODAY">Aujourd'hui</option>
                        <option value="WEEK">Cette semaine</option>
                        <option value="MONTH">Ce mois</option>
                        <option value="QUARTER">Ce trimestre</option>
                    </select>
                </div>
                <div className="text-sm text-gray-500">
                    Dernière mise à jour: {new Date().toLocaleString()}
                </div>
            </div>

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
                    <p className="text-2xl font-bold text-red-500">{mapData?.data.deletedUsers}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

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
                            <Line type="monotone" dataKey="trafficInfo" stroke="#FFBB28" name="Info Trafic" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Types de Recherches sur l'Itinéraires</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={itineraryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ mode, percent }) => `${mode}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="count"
                            >
                                {itineraryData.map((_mode , index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>


                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Types de Recherches Sinagnialment</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={reportData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ type, percent }) => `${type}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="count"
                            >
                                {reportData.map((_type , index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

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


            </div>
        </div>
    );
};

export default Dashboard;