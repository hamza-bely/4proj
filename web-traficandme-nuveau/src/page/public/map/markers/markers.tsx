import { useEffect, useState } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import { Alert } from "../../../../assets/kit-ui/alert.tsx";
import PopupContent from "./popup-content.tsx";
import { getUserRole } from "../../../../services/service/token-service.tsx";
import Cookies from "js-cookie";
import { IoMdClose } from "react-icons/io";
import { Report } from "../../../../services/model/report.tsx"
import { useTranslation } from "react-i18next";
import useReportStore from "../../../../services/store/report-store.tsx";
import {toast} from "react-toastify";
import {MarkerModel} from "../model/map.tsx";
import {getAddressFromCoordinates} from "../serach/methode.tsx";


const Markers: React.FC<any> = ({ map }) => {
    const { t } = useTranslation();
    const { reports, fetchReports, createReport } = useReportStore();
    const token = Cookies.get("authToken");
    const [userRole, setRole] = useState<string | string[] | null>(null);
    const [selectedSignal, setSelectedSignal] = useState<Report | null>(null);
    const [createdMarkers, setCreatedMarkers] = useState<tt.Marker[]>([]);
    const [currentZoom, setCurrentZoom] = useState<number>(0);
    const [isAddingReport, setIsAddingReport] = useState<boolean>(false);
    const [showAddReportModal, setShowAddReportModal] = useState<boolean>(false);
    const [newReportData, setNewReportData] = useState<MarkerModel>({
        type: "ACCIDENTS",
        latitude: 0,
        longitude: 0,
        status : "",
        address : ""
    });

    const updateMarkersVisibility = (zoom: number) => {
        createdMarkers.forEach(marker => {
            if (zoom >= 12) {
                marker.getElement().style.display = 'block';
            } else {
                marker.getElement().style.display = 'none';
            }
        });
    };

    const createMarkers = () => {
        if (!map) return;
        createdMarkers.forEach(marker => marker.remove());

        const markers: tt.Marker[] = [];
        reports.filter(report => report.status === "AVAILABLE")
            .forEach((report) => {
            const coordinates = [report.longitude ?? 0,report.latitude ?? 0];
            const markerElement = document.createElement("div");
            markerElement.className = "rounded-full overflow-hidden  border-white";
            markerElement.style.marginBottom = "50px";
            const imageSrc = (() => {
                switch (report.type) {
                    case "ACCIDENTS":
                        return "/images/icon-map/accidents.jpg";
                    case "TRAFFIC":
                        return "/images/icon-map/traffic.jpg";
                    case "ROADS_CLOSED":
                        return "/images/icon-map/roads_closed.jpg";
                    case "POLICE_CHECKS":
                        return "/images/icon-map/police.jpg";
                    case "OBSTACLES":
                        return "/images/icon-map/obstacles.jpg";
                    default:
                        return "/images/icon-map/default.jpg";
                }
            })();
                    markerElement.innerHTML = `
            <div class="flex flex-col items-center">
                <img src="${imageSrc}" alt="Signal Icon"
                    class="rounded-full w-10 h-10 border-2 border-white shadow-md" />
                <div class="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-blue-500"></div>
            </div>
            `;
            const marker = new tt.Marker({ element: markerElement })
                .setLngLat(coordinates as [number, number])
                .addTo(map);

            marker.getElement().addEventListener("click", () => {
                setSelectedSignal(report);
            });

            markers.push(marker);
        });

        setCreatedMarkers(markers);

        const currentZoom = map.getZoom();
        updateMarkersVisibility(currentZoom);
    };

    const handleZoomChange = () => {
        if (!map) return;

        const zoom = map.getZoom();
        setCurrentZoom(zoom);
        updateMarkersVisibility(currentZoom);
    };

    const handleAddReportClick = () => {
        toast.info(t('map.click-map'));
        setIsAddingReport(true);
        const messageContainer = document.createElement("div");
        messageContainer.id = "click-message";
        messageContainer.className = "fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg z-50";
        messageContainer.textContent = t("Cliquez sur un point de la carte pour créer un rapport");
        document.body.appendChild(messageContainer);
    };

    const handleMapClick = (e: any) => {
        if (!isAddingReport) return;

        const messageContainer = document.getElementById("click-message");
        if (messageContainer) {
            document.body.removeChild(messageContainer);
        }
        const { lng, lat } = e.lngLat;

        setNewReportData({
            ...newReportData,
            latitude: lat,
            longitude: lng
        });

        setShowAddReportModal(true);
        setIsAddingReport(false);
    };

    const handleSubmitNewReport = async () => {
        newReportData.address = await getAddressFromCoordinates(newReportData.latitude,newReportData.longitude,t)

        try {
            newReportData.status = userRole === "ROLE_ADMIN" ?  "AVAILABLE" : "PENDING"
            console.log(newReportData )
            await createReport(newReportData);
            setShowAddReportModal(false);
            await fetchReports();
        } catch (error) {
            console.error("Erreur lors de l'ajout du rapport", error);
        }
    };

    useEffect(() => {
        setRole(getUserRole());

        if (!map) return;

        const initialZoom = map.getZoom();
        setCurrentZoom(initialZoom);

        createMarkers();

        map.on('zoom', handleZoomChange);
        map.on('click', handleMapClick);

        return () => {
            createdMarkers.forEach(marker => marker.remove());
            map.off('zoom', handleZoomChange);
            map.off('click', handleMapClick);

            const messageContainer = document.getElementById("click-message");
            if (messageContainer) {
                document.body.removeChild(messageContainer);
            }
        };
    }, [map, reports, token, isAddingReport,userRole]);

    useEffect(() => {
        if (map) {
            createMarkers();
        }
    }, [reports]);

    useEffect(() => {
        const loadReports = async () => {
            try {
                await fetchReports();
            } catch (error) {
                console.error("Erreur lors du chargement des rapports", error);
            }
        };

        loadReports();
    }, []);

    return (
        <>
            <Alert className="w-20" open={!!selectedSignal} onClose={() => setSelectedSignal(null)}>
                {selectedSignal && (
                    <div className="rounded-lg">
                        <div style={{width: "100%", display: "flex", justifyContent: "flex-end"}} className="cursor-pointer flex item-end">
                            <IoMdClose onClick={() => setSelectedSignal(null)} />
                        </div>
                        <PopupContent
                            info={selectedSignal}
                        />
                    </div>
                )}
            </Alert>

            {showAddReportModal && (
                <div className="fixed inset-0   flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 max-w-md">
                        <h2 className="text-xl font-bold mb-4">{t("report.new_report")}</h2>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Type")}</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={newReportData.type}
                                onChange={(e) => setNewReportData({...newReportData, type: e.target.value})}
                            >
                                <option value="ACCIDENTS">{t("reportTypes.accidents")}</option>
                                <option value="TRAFFIC">{t("reportTypes.traffic")}</option>
                                <option value="ROADS_CLOSED">{t("reportTypes.roadsClosed")}</option>
                                <option value="POLICE_CHECKS">{t("reportTypes.policeChecks")}</option>
                                <option value="OBSTACLES">{t("reportTypes.obstacles")}</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <p className="text-sm text-gray-600">
                                {t("Coordonnées")}: {newReportData.latitude.toFixed(6)}, {newReportData.longitude.toFixed(6)}
                            </p>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                onClick={() => setShowAddReportModal(false)}
                            >
                                {t("common.cancel")}
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                onClick={handleSubmitNewReport}
                            >
                                {t("common.add")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {userRole &&
                <button
                    style={{zIndex: "1001"}}
                    className="fixed bottom-10 right-10 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600"
                    onClick={handleAddReportClick}
                >
                    +
                </button>
            }
        </>
    );
};

export default Markers;