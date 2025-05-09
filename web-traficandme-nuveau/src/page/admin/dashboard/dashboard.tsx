import React, { useState, useEffect } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';
import { AdminSumStats } from '../../../services/model/user';
import { useTranslation } from 'react-i18next';
import Spinner from '../../../components/sniper/sniper';
import {
    fetchApiStatisticsPerTime,
    fetchReportsByTypeStatistics,
    fetchRoutesByModeStatistics, fetchSumOfMapStatistic,
    fetchTrafficDataFromTomTomApi
} from "../../../services/service/admin-serivce.tsx";
interface ApiUsageData {
    date: string;
    routeSearches: number;
    trafficInfo: number;
}
interface RouteData {
    mode: string;
    count: number;
}
interface ReportData {
    type: string;
    count: number;
}

interface TrafficData {
    address_start: string;
    address_end: string;
    averageSpeed: number;
    congestionCount: number;
    itineraryPointCount: number;
  }
const Dashboard: React.FC = () => {
    const { t } = useTranslation();
    const [reportData, setReportData] = useState<ReportData[]>([]);
    const [itineraryData, setItineraryData] = useState<RouteData[]>([]);
    const [traffic, setTraffic] = useState<TrafficData[]>([]);
    const [usageData, setUsageData] = useState<ApiUsageData[]>([]);
    const [mapData, setMapData] = useState<AdminSumStats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [timeRange, setTimeRange] = useState<string>('WEEK');
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    

    useEffect(() => {
        fetchSumOfMapStatistic()
            .then(setMapData)
            .catch(err => console.error('Erreur fetchSumOfMapStatistic', err));
    }, []);

    useEffect(() => {
        fetchReportsByTypeStatistics()
            .then(res => setReportData(res.data))
            .catch(err => console.error('Erreur fetchReportsByTypeStatistics', err));
    }, []);

    useEffect(() => {
        fetchRoutesByModeStatistics()
            .then(res => setItineraryData(res.data))
            .catch(err => console.error('Erreur fetchRoutesByModeStatistics', err));
    }, []);
    useEffect(() => {
        fetchTrafficDataFromTomTomApi()
            .then(res => setTraffic(res.data))
            .catch(err => console.error('Erreur fetchTrafficDataFromTomTomApi', err));
            console.log(traffic)
    }, []);
    useEffect(() => {
        if (!timeRange) return;
        setLoading(true);
        fetchApiStatisticsPerTime(timeRange)
            .then(res => setUsageData(res.data))
            .catch(err => console.error('Erreur fetchApiStatisticsPerTime', err))
            .finally(() => setLoading(false));
    }, [timeRange]);
    const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTimeRange(e.target.value);
    };
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner />
            </div>
        );
    }
    return (
        <div className="p-4 bg-gray-50 rounded-lg">
            <h1 className="text-2xl font-bold mb-6">{t('dashboard.title')}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">{t('dashboard.userCount')}</h3>
                    <p className="text-2xl font-bold">{mapData?.data.userTotal}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">{t('dashboard.routeSearches')}</h3>
                    <p className="text-2xl font-bold">{mapData?.data.routeSearches}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">{t('dashboard.trafficInfo')}</h3>
                    <p className="text-2xl font-bold">{mapData?.data.trafficInfo}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">{t('dashboard.userDeleted')}</h3>
                    <p className="text-2xl font-bold text-red-500">{mapData?.data.deletedUsers}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">{t('dashboard.dailyUsage')}</h2>
                    <div className="mb-6 flex justify-between items-center">
                <div>
                    <label htmlFor="timeRange" className="mr-2 font-medium">
                        {t('dashboard.period')}:
                    </label>
                    <select
                        id="timeRange"
                        className="p-2 border rounded"
                        value={timeRange}
                        onChange={handleTimeRangeChange}
                    >
                        <option value="TODAY">{t('dashboard.today')}</option>
                        <option value="WEEK">{t('dashboard.week')}</option>
                        <option value="MONTH">{t('dashboard.month')}</option>
                        <option value="QUARTER">{t('dashboard.quarter')}</option>
                    </select>
                </div>
                <div className="text-sm text-gray-500">
                    {t('dashboard.lastUpdate')}: {new Date().toLocaleString()}
                </div>
            </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={usageData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="routeSearches"
                                stroke="#0088FE"
                                name={t('dashboard.routeSearches')}
                            />
                            <Line
                                type="monotone"
                                dataKey="trafficInfo"
                                stroke="#FFBB28"
                                name={t('dashboard.trafficInfo')}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">{t('dashboard.itinerarySearchTypes')}</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={itineraryData}
                                dataKey="count"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label={({ mode, percent }) =>
                                    `${mode}: ${(percent! * 100).toFixed(0)}%`
                                }
                                labelLine={false}
                            >
                                {itineraryData.map((_, idx) => (
                                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">{t('dashboard.reportTypes')}</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={reportData}
                                dataKey="count"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label={({ type, percent }) =>
                                    `${type}: ${(percent! * 100).toFixed(0)}%`
                                }
                                labelLine={false}
                            >
                                {reportData.map((_, idx) => (
                                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
  <h2 className="text-lg font-semibold mb-4 text-gray-800">{t('dashboard.apiErrorTypes')}</h2>

  {itineraryData.length > 0 ? (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Départ</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Arrivée</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Vitesse moyenne</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Congestions</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Points d'itinéraire</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {traffic.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50 transition">
              <td className="px-4 py-3 text-sm text-gray-800">{item.address_start}</td>
              <td className="px-4 py-3 text-sm text-gray-800">{item.address_end}</td>
              <td className="px-4 py-3 text-sm text-blue-600 font-medium">
                {item.averageSpeed.toFixed(2)} km/h
              </td>
              <td className="px-4 py-3 text-sm text-red-600 font-medium">
                {item.congestionCount}
              </td>
              <td className="px-4 py-3 text-sm text-green-600 font-medium">
                {item.itineraryPointCount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p className="text-gray-500 text-sm mt-4">Aucun itinéraire disponible.</p>
  )}
</div>


            </div>
        </div>
    );
};
export default Dashboard;